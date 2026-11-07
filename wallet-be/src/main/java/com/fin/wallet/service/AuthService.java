package com.fin.wallet.service;

import com.fin.wallet.dto.auth.AuthResponse;
import com.fin.wallet.dto.auth.LoginRequest;
import com.fin.wallet.dto.auth.RefreshRequest;
import com.fin.wallet.dto.auth.RegisterRequest;
import com.fin.wallet.entity.User;
import com.fin.wallet.exception.BadRequestException;
import com.fin.wallet.repository.UserRepository;
import com.fin.wallet.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Giriş, kayıt, token yenileme ve çıkış: şifreyi kontrol eder, yeni kullanıcıyı kaydeder, token üretir
@Service
@RequiredArgsConstructor
public class AuthService {

	// Kullanıcı adı mı yoksa şifre mi yanlış, bilerek söylenmez; yoksa saldırgan hangi kullanıcı adlarının kayıtlı olduğunu öğrenir
	private static final String INVALID_CREDENTIALS = "Invalid username or password";

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtService jwtService;

	private final RefreshTokenService refreshTokenService;

	// Artık DB'ye yazıyor (refresh token kaydı), bu yüzden transaction içinde
	@Transactional
	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUserName(request.userName())
				.orElseThrow(() -> new BadCredentialsException(INVALID_CREDENTIALS));

		// matches(düz şifre, veritabanındaki hash): sıra önemli
		if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new BadCredentialsException(INVALID_CREDENTIALS);
		}

		return issueTokens(user);
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByUserName(request.userName())) {
			throw new BadRequestException("Username is already taken");
		}
		if (userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("Email is already registered");
		}

		User user = new User();
		user.setFirstName(request.firstName());
		user.setLastName(request.lastName());
		user.setUserName(request.userName());
		user.setEmail(request.email());
		// Şifre asla düz metin kaydedilmez
		user.setPassword(passwordEncoder.encode(request.password()));
		userRepository.save(user);

		// Kayıt olan kullanıcı ayrıca login olmak zorunda kalmasın
		return issueTokens(user);
	}

	// Bilerek @Transactional DEĞİL. rotate() kendi transaction'ını açıp tekrar kullanımda
	// noRollbackFor ile revokeAll'u commit ediyor. Burada bir dış transaction olsaydı rotate ona katılır,
	// exception dış metottan geçerken dış transaction rollback olur ve revokeAll geri alınırdı.
	public AuthResponse refresh(RefreshRequest request) {
		RefreshTokenService.RotationResult result = refreshTokenService.rotate(request.refreshToken());

		// issueTokens kullanılmaz: yeni refresh token'ı rotate zaten üretti, ikincisi gereksiz bir oturum açardı
		return new AuthResponse(jwtService.generateToken(result.user().getUserName()), result.refreshToken());
	}

	// Sadece bu cihazın oturumunu kapatır. Access token süresi dolana kadar (en fazla 15 dk) çalışmaya devam eder;
	// mobil uygulama kendi tarafında iki token'ı da siler.
	public void logout(RefreshRequest request) {
		refreshTokenService.revoke(request.refreshToken());
	}

	// Login, register: kısa ömürlü access token + DB'ye kaydedilen uzun ömürlü refresh token
	private AuthResponse issueTokens(User user) {
		return new AuthResponse(jwtService.generateToken(user.getUserName()), refreshTokenService.create(user));
	}

}
