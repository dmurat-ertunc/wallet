package com.fin.wallet.repository;

import com.fin.wallet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUserName(String userName);

	// Kayıt sırasında kullanıcı adı / e-posta daha önce alınmış mı diye bakar (tüm kaydı çekmez)
	boolean existsByUserName(String userName);

	boolean existsByEmail(String email);

}
