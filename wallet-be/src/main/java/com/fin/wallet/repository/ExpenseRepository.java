package com.fin.wallet.repository;

import com.fin.wallet.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

// JpaSpecificationExecutor lets ExpenseQueryService run dynamic criteria queries
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

	// "UserId" resolves to expense.user.id, so only the owner's expense is found
	Optional<Expense> findByIdAndUserId(Long id, Long userId);

	boolean existsByIdAndUserId(Long id, Long userId);

}
