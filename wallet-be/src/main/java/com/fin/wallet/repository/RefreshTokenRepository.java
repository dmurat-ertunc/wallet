package com.fin.wallet.repository;

import com.fin.wallet.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    // /auth/refresh: gelen token SHA-256 ile hash'lenir ve kayıt bu hash ile aranır
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    // Kullanıcının aktif tüm token'larını tek sorguda iptal eder
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :now " +
            "WHERE rt.user.id = :userId AND rt.revokedAt IS NULL")
    int revokeAllActiveByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

}
