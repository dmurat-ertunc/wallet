package com.fin.wallet.service;

import com.fin.wallet.dto.ExpenseDTO;

import java.util.Optional;

// Write operations and single-record reads; filtered lists live in ExpenseQueryService
public interface ExpenseService {

	ExpenseDTO save(ExpenseDTO expenseDTO);

	ExpenseDTO update(ExpenseDTO expenseDTO);

	Optional<ExpenseDTO> partialUpdate(ExpenseDTO expenseDTO);

	Optional<ExpenseDTO> findOne(Long id);

	void delete(Long id);

}
