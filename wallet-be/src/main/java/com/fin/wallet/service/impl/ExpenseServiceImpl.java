package com.fin.wallet.service.impl;

import com.fin.wallet.dto.ExpenseDTO;
import com.fin.wallet.entity.Expense;
import com.fin.wallet.exception.ResourceNotFoundException;
import com.fin.wallet.mapper.ExpenseMapper;
import com.fin.wallet.repository.ExpenseRepository;
import com.fin.wallet.security.CurrentUserService;
import com.fin.wallet.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// Every operation is scoped to the user in the JWT; the userId in the request body is ignored.
// Another user's expense is reported as not found (404) rather than forbidden, so ids of other users' data are not revealed.
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

	private static final String RESOURCE_NAME = "Expense";

	private final ExpenseRepository expenseRepository;

	private final ExpenseMapper expenseMapper;

	private final CurrentUserService currentUserService;

	@Override
	public ExpenseDTO save(ExpenseDTO expenseDTO) {
		log.debug("Request to save Expense : {}", expenseDTO);
		Expense expense = expenseMapper.toEntity(expenseDTO);
		expense.setUser(currentUserService.getCurrentUser());
		return expenseMapper.toDto(expenseRepository.save(expense));
	}

	@Override
	public ExpenseDTO update(ExpenseDTO expenseDTO) {
		log.debug("Request to update Expense : {}", expenseDTO);
		Expense expense = findOwnExpense(expenseDTO.getId())
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, expenseDTO.getId()));
		expenseMapper.update(expense, expenseDTO);
		// Flush so @UpdateTimestamp is applied before the response is built
		return expenseMapper.toDto(expenseRepository.saveAndFlush(expense));
	}

	@Override
	public Optional<ExpenseDTO> partialUpdate(ExpenseDTO expenseDTO) {
		log.debug("Request to partially update Expense : {}", expenseDTO);
		return findOwnExpense(expenseDTO.getId())
				.map(expense -> {
					expenseMapper.partialUpdate(expense, expenseDTO);
					return expenseRepository.saveAndFlush(expense);
				})
				.map(expenseMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<ExpenseDTO> findOne(Long id) {
		log.debug("Request to get Expense : {}", id);
		return findOwnExpense(id).map(expenseMapper::toDto);
	}

	@Override
	public void delete(Long id) {
		log.debug("Request to delete Expense : {}", id);
		if (!expenseRepository.existsByIdAndUserId(id, currentUserService.getCurrentUser().getId())) {
			throw new ResourceNotFoundException(RESOURCE_NAME, id);
		}
		expenseRepository.deleteById(id);
	}

	private Optional<Expense> findOwnExpense(Long id) {
		return expenseRepository.findByIdAndUserId(id, currentUserService.getCurrentUser().getId());
	}

}
