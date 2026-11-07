package com.fin.wallet.service;

import com.fin.wallet.entity.RefreshToken;
import com.fin.wallet.entity.User;
import com.fin.wallet.exception.InvalidRefreshTokenException;
import com.fin.wallet.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

// Refresh token'ların tüm yaşam döngüsü: üretme, doğrulama + yenileme (rotation), iptal.
// JWT'den habersizdir; access token üretmek ve iki token'ı birleştirmek AuthService'in işi.
@Service
public class RefreshTokenService {

	// 32 byte = 256 bit rastgelelik. SHA-256'nın yeterli olması (BCrypt'e gerek olmaması) bu uzunluğa dayanır.
	private static final int TOKEN_BYTES = 32;

	// Random / Math.random tahmin edilebilir; token üretiminde mutlaka kriptografik olarak güvenli SecureRandom kullanılır.
	// Thread-safe olduğu için tek bir nesne bütün istekler tarafından paylaşılabilir.
	private static final SecureRandom SECURE_RANDOM = new SecureRandom();

	private final RefreshTokenRepository refreshTokenRepository;

	// Refresh token'ın yaşam süresi (application.yaml: app.refresh-token.ttl)
	private final Duration ttl;

	// @RequiredArgsConstructor yerine elle yazıldı: Lombok, @Value'yu constructor parametresine taşımaz
	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
							   @Value("${app.refresh-token.ttl}") Duration ttl) {
		this.refreshTokenRepository = refreshTokenRepository;
		this.ttl = ttl;
	}

	// rotate() sonucu: AuthService yeni access token üretmek için kullanıcıya, mobile dönmek için yeni refresh token'a ihtiyaç duyar
	public record RotationResult(User user, String refreshToken) {
	}

	// Login, register ve rotate'te çağrılır. Ham token sadece bu anda vardır:
	// DB'ye hash'i yazılır, ham hali istemciye döner ve sunucuda hiçbir yerde saklanmaz.
	@Transactional
	public String create(User user) {
		String rawToken = generateRawToken();

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setTokenHash(hash(rawToken));
		refreshToken.setUser(user);
		refreshToken.setExpiresAt(LocalDateTime.now().plus(ttl));
		refreshTokenRepository.save(refreshToken);

		return rawToken;
	}

	// /auth/refresh: gelen token'ı doğrular, iptal eder ve yerine yenisini verir (rotation).
	// noRollbackFor: tekrar kullanımda tüm oturumları iptal edip exception fırlatıyoruz.
	// Bu olmasaydı exception transaction'ı geri alır, revokeAll da geri alınır ve saldırgan içeride kalırdı.
	@Transactional(noRollbackFor = InvalidRefreshTokenException.class)
	public RotationResult rotate(String rawToken) {
		RefreshToken current = refreshTokenRepository.findByTokenHash(hash(rawToken))
				.orElseThrow(InvalidRefreshTokenException::new);

		LocalDateTime now = LocalDateTime.now();
		User user = current.getUser();

		// İptal edilmiş bir token tekrar geldi: ya çalındı ya da saldırgan eski bir token deniyor.
		// Hangisinin gerçek kullanıcı olduğunu bilemeyiz, bu yüzden kullanıcının bütün oturumlarını kapatırız.
		// Süre kontrolünden önce yapılır: aksi halde süresi dolmuş çalıntı bir token sessizce reddedilir ve saldırı fark edilmez.
		if (current.getRevokedAt() != null) {
			refreshTokenRepository.revokeAllActiveByUserId(user.getId(), now);
			throw new InvalidRefreshTokenException();
		}

		if (current.getExpiresAt().isBefore(now)) {
			throw new InvalidRefreshTokenException();
		}

		// Kullanıcı pasife alındıysa (ban) oturumu yenilenmez.
		// isActive() çağrısı LAZY user'ı transaction içinde yükler; AuthService dışarıda getUserName() kullanabilir.
		if (!user.isActive()) {
			refreshTokenRepository.revokeAllActiveByUserId(user.getId(), now);
			throw new InvalidRefreshTokenException();
		}

		// save() gerekmez: current managed bir entity, commit'te dirty checking UPDATE atar
		current.setRevokedAt(now);

		return new RotationResult(user, create(user));
	}

	// /auth/logout: sadece bu cihazın oturumunu kapatır.
	// Idempotent: token bulunamasa veya zaten iptal edilmiş olsa da hata fırlatmaz, çıkış her zaman başarılıdır.
	@Transactional
	public void revoke(String rawToken) {
		refreshTokenRepository.findByTokenHash(hash(rawToken))
				.filter(token -> token.getRevokedAt() == null)
				.ifPresent(token -> token.setRevokedAt(LocalDateTime.now()));
	}

	// Tüm cihazlardan çıkış ve şifre değişikliği: kullanıcının aktif bütün refresh token'larını tek sorguda iptal eder
	@Transactional
	public void revokeAll(Long userId) {
		refreshTokenRepository.revokeAllActiveByUserId(userId, LocalDateTime.now());
	}

	// 256 bit rastgele değer → URL-safe Base64 (padding'siz, 43 karakter).
	// URL-safe: normal Base64'teki "+" ve "/" URL'de veya header'da sorun çıkarabilir.
	private String generateRawToken() {
		byte[] bytes = new byte[TOKEN_BYTES];
		SECURE_RANDOM.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

	// SHA-256 → hex (64 karakter, entity'deki token_hash kolonunun uzunluğu).
	// Deterministiktir: aynı token hep aynı hash'i verir, bu yüzden findByTokenHash ile aranabilir.
	private String hash(String rawToken) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			return HexFormat.of().formatHex(digest.digest(rawToken.getBytes(StandardCharsets.UTF_8)));
		} catch (NoSuchAlgorithmException e) {
			// Her JVM SHA-256'yı desteklemek zorunda, pratikte buraya hiç gelinmez
			throw new IllegalStateException("SHA-256 is not available", e);
		}
	}

}
