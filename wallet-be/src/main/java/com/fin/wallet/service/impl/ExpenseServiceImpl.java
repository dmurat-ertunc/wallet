package com.fin.wallet.service.impl;

import com.fin.wallet.dto.ExpenseDTO;
import com.fin.wallet.entity.Expense;
import com.fin.wallet.entity.User;
import com.fin.wallet.exception.BadRequestException;
import com.fin.wallet.exception.ResourceNotFoundException;
import com.fin.wallet.mapper.ExpenseMapper;
import com.fin.wallet.repository.ExpenseRepository;
import com.fin.wallet.repository.UserRepository;
import com.fin.wallet.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

	private static final String RESOURCE_NAME = "Expense";

	private final ExpenseRepository expenseRepository;

	private final UserRepository userRepository;

	private final ExpenseMapper expenseMapper;

	@Override
	public ExpenseDTO save(ExpenseDTO expenseDTO) {
		log.debug("Request to save Expense : {}", expenseDTO);
		Expense expense = expenseMapper.toEntity(expenseDTO);
		expense.setUser(findUser(expenseDTO.getUserId()));
		return expenseMapper.toDto(expenseRepository.save(expense));
	}

	@Override
	public ExpenseDTO update(ExpenseDTO expenseDTO) {
		log.debug("Request to update Expense : {}", expenseDTO);
		Expense expense = expenseRepository.findById(expenseDTO.getId())
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, expenseDTO.getId()));
		expenseMapper.update(expense, expenseDTO);
		expense.setUser(findUser(expenseDTO.getUserId()));
		// Flush so @UpdateTimestamp is applied before the response is built
		return expenseMapper.toDto(expenseRepository.saveAndFlush(expense));
	}

	@Override
	public Optional<ExpenseDTO> partialUpdate(ExpenseDTO expenseDTO) {
		log.debug("Request to partially update Expense : {}", expenseDTO);
		return expenseRepository.findById(expenseDTO.getId())
				.map(expense -> {
					expenseMapper.partialUpdate(expense, expenseDTO);
					if (expenseDTO.getUserId() != null) {
						expense.setUser(findUser(expenseDTO.getUserId()));
					}
					return expenseRepository.saveAndFlush(expense);
				})
				.map(expenseMapper::toDto);
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<ExpenseDTO> findOne(Long id) {
		log.debug("Request to get Expense : {}", id);
		return expenseRepository.findById(id).map(expenseMapper::toDto);
	}

	@Override
	public void delete(Long id) {
		log.debug("Request to delete Expense : {}", id);
		if (!expenseRepository.existsById(id)) {
			throw new ResourceNotFoundException(RESOURCE_NAME, id);
		}
		expenseRepository.deleteById(id);
	}

	// The user id comes from the request body, so a missing user is a client error (400), not 404
	private User findUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new BadRequestException("User not found with id: " + userId));
	}

}
