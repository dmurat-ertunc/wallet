package com.fin.wallet.service;

import com.fin.wallet.dto.auth.AuthResponse;
import com.fin.wallet.dto.auth.LoginRequest;
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

// Giriş ve kayıt işlemleri: şifreyi kontrol eder, yeni kullanıcıyı kaydeder, token üretir
@Service
@RequiredArgsConstructor
public class AuthService {

	// Kullanıcı adı mı yoksa şifre mi yanlış, bilerek söylenmez; yoksa saldırgan hangi kullanıcı adlarının kayıtlı olduğunu öğrenir
	private static final String INVALID_CREDENTIALS = "Invalid username or password";

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtService jwtService;

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUserName(request.userName())
				.orElseThrow(() -> new BadCredentialsException(INVALID_CREDENTIALS));

		// matches(düz şifre, veritabanındaki hash): sıra önemli
		if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new BadCredentialsException(INVALID_CREDENTIALS);
		}

		return new AuthResponse(jwtService.generateToken(user.getUserName()));
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
		return new AuthResponse(jwtService.generateToken(user.getUserName()));
	}

}
