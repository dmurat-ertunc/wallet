package com.fin.wallet.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service  //Spring bu sınıftan bir nesne oluşturur ve isteyen sınıflara verir.
public class JwtService {
    private final SecretKey key;

    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret, //application.yaml'daki değeri okuyup parametreye koyar. WebConfig'te de aynısını yapmıştın
                      @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); //yaml'daki yazı hâlindeki anahtarı byte'lara çevirir.
        this.expirationMs = expirationMs; //bu byte'lardan imzalamada kullanılacak anahtar nesnesini üretir. Anahtar 256 bitten kısaysa burada hata verir.
    }

    public String generateToken(String userName) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userName) // token'ın kime ait olduğu. Payload'da "sub": "murat" olarak görünür.
                .issuedAt(now) // üretilme zamanı ("iat").
                .expiration(new Date(now.getTime() + expirationMs)) // şu an + 24 saat; bu süreden sonra token geçersiz olur ("exp").
                .signWith(key) //  gizli anahtarla imzalar.
                .compact(); // hepsini xxxxx.yyyyy.zzzzz biçiminde tek bir yazıya çevirir.
    }

//    eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtdXJhdCIsImlhdCI6MTc5MzI3MDQwMCwiZXhwIjoxNzkzMzU2ODAwfQ.-MOAfLIHUDupO7lmmnwJf0_OihMWQxOFQvKXwwlpeFw
//    └───── xxxxx ───────┘ └──────────────────────────── yyyyy ─────────────────────────────┘ └───────────────── zzzzz ──────────────────┘
//          HEADER                                       PAYLOAD                                                SIGNATURE

// HEADER
    //eyJhbGciOiJIUzI1NiJ9 şifreli bir şey değil, sadece Base64 ile kodlanmış bir JSON. Çözünce şu çıkıyor: { "alg": "HS256" }
    // Anlamı: "Bu token HMAC-SHA256 algoritmasıyla imzalandı." Bunu JJWT, signWith(key) satırında kendisi ekliyor.

// PAYLOAD
    //"Bu token kimin, ne zamana kadar geçerli?"
    //{
    //    "sub": "murat",
    //    "iat": 1793270400,
    //    "exp": 1793356800
    //}
    //sub	subject	.subject(userName)	Token kime ait
    //iat	issued at	.issuedAt(now)	Ne zaman üretildi (29 Ekim 2026, 13:40)
    //exp	expiration	.expiration(...)	Ne zaman geçersiz olacak (30 Ekim, 13:40, yani 24 saat sonra)
    //Sayılar 1 Ocak 1970'ten beri geçen saniye sayısı. Bilgisayarlarda zamanı tutmanın standart yolu bu.
    //
    // Bu kısım herkes tarafından okunabilir. Token'ı jwt.io sitesine yapıştırırsan payload'ı hemen görürsün. Bu yüzden payload'a asla şifre, kart numarası gibi bilgiler konmaz.

// SIGNATURE
    //    "Bu token'ı gerçekten sunucu mu üretti?"
    //
    //    Burası işin kalbi. İmza şöyle hesaplanıyor:
    //    imza = HMAC-SHA256( header + "." + payload , GİZLİ_ANAHTAR )
    //    Header ve payload, sadece sunucunun bildiği gizli anahtarla (application.yaml'daki secret) karıştırılıyor ve ortaya bir "parmak izi" çıkıyor.





    // İmza bozuksa veya süresi dolmuşsa JwtException fırlatır
    public String extractUserName(String token) {
        return Jwts.parser()
                .verifyWith(key) // "imzayı bu anahtarla kontrol et."
                .build()
                // asıl kontrol burada yapılır. İmza tutmuyorsa ya da exp geçmişse exception fırlatır. Ayrıca if yazmana gerek yok
                // mesela token süresi bitmiş ise ExpiredJwtException hatası fırlatıyor
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();  // her şey yolundaysa payload'dan sub değerini, yani kullanıcı adını alır.
    }

}
