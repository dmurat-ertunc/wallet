package com.fin.wallet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

// Kullanıcının oturumunu temsil eder: her login (her cihaz) bir kayıt oluşturur.
// Access token süresi dolunca mobil uygulama bu token ile /auth/refresh'e gidip yeni access token alır.
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"tokenHash", "user"})
@Entity
@Table(name = "refresh_tokens", indexes = {
		@Index(name = "idx_refresh_tokens_user_id", columnList = "user_id")
})
public class RefreshToken extends BaseEntity {

//	Token'ın kendisi değil, SHA-256 hash'i saklanır. DB sızarsa saldırgan bu değerle istek atamaz.
//	BCrypt yerine SHA-256: aynı girdi hep aynı hash'i verdiği için findByTokenHash ile kayıt bulunabilir.
//	Token SecureRandom ile üretilen 256 bit rastgele bir değer olduğu için brute force zaten imkânsız, yavaş hash'e gerek yok.
//	length = 64	SHA-256 çıktısı 32 byte, hex olarak 64 karakter.
//	unique = true	Aynı token iki kez kaydedilemez, ayrıca otomatik index oluşur (refresh'te bu kolona göre arama yapılıyor).
	@Column(name = "token_hash", nullable = false, unique = true, length = 64)
	private String tokenHash;

//	Bir kullanıcının birden fazla cihazı, dolayısıyla birden fazla refresh token'ı olabilir.
//	fetch = FetchType.LAZY	Token okunduğunda kullanıcı hemen yüklenmez, ilk getUser() erişiminde yüklenir.
//	User tarafına @OneToMany eklenmedi: token'lar kullanıcı üzerinden değil, hep repository'den sorgulanıyor.
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "expires_at", nullable = false)
	private LocalDateTime expiresAt;

//	null ise token aktiftir. Rotation veya logout'ta kayıt silinmez, bu alan doldurulur.
//	Sebebi: iptal edilmiş bir token tekrar gelirse "bu token çalınmış" diye anlayıp
//	kullanıcının tüm token'larını iptal edebilmek. Kayıt silinseydi bu tekrar kullanım fark edilmezdi.
	@Column(name = "revoked_at")
	private LocalDateTime revokedAt;

}
