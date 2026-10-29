package com.fin.wallet.controller;

import com.fin.wallet.dto.auth.AuthResponse;
import com.fin.wallet.dto.auth.LoginRequest;
import com.fin.wallet.dto.auth.RegisterRequest;
import com.fin.wallet.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Herkese açık giriş/kayıt uç noktaları (SecurityConfig'te /api/auth/** permitAll).
// İstek gövdeleri şifre içerdiği için burada bilerek log yazılmaz.
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

}
