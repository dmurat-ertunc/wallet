package com.fin.wallet.security;

import com.fin.wallet.entity.User;
import com.fin.wallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

// İsteği yapan kullanıcıyı verir. Kim olduğu istemcinin gönderdiği bir id'den değil, token'dan gelir:
// JwtAuthenticationFilter token'daki kullanıcı adını SecurityContext'e koyar, burada o ad ile kullanıcı bulunur.
// Sadece token isteyen uç noktalarda çağrılmalı (SecurityConfig'te /api/auth/** dışındaki her şey).
@Service
@RequiredArgsConstructor
public class CurrentUserService {

	private final UserRepository userRepository;

	public User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// SecurityConfig kimliksiz istekleri controller'a gelmeden 401 ile reddettiği için normalde buraya düşülmez
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new IllegalStateException("No authenticated user in the security context");
		}
		return userRepository.findByUserName(authentication.getName())
				.orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + authentication.getName()));
	}

}
