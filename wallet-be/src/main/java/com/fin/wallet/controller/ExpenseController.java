package com.fin.wallet.controller;

import com.fin.wallet.criteria.ExpenseCriteria;
import com.fin.wallet.dto.ExpenseDTO;
import com.fin.wallet.exception.BadRequestException;
import com.fin.wallet.exception.ResourceNotFoundException;
import com.fin.wallet.service.ExpenseService;
import com.fin.wallet.service.query.ExpenseQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

	private static final String RESOURCE_NAME = "Expense";

	private static final String TOTAL_COUNT_HEADER = "X-Total-Count";

	private final ExpenseService expenseService;

	private final ExpenseQueryService expenseQueryService;

	@PostMapping
	public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO expenseDTO) {
		log.debug("REST request to save Expense : {}", expenseDTO);
		if (expenseDTO.getId() != null) {
			throw new BadRequestException("A new expense cannot already have an id");
		}
		ExpenseDTO result = expenseService.save(expenseDTO);
		return ResponseEntity.created(URI.create("/api/expenses/" + result.getId())).body(result);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseDTO expenseDTO) {
		log.debug("REST request to update Expense : {}, {}", id, expenseDTO);
		validateId(id, expenseDTO);
		return ResponseEntity.ok(expenseService.update(expenseDTO));
	}

	// Only the fields sent in the body are changed, so @Valid is not applied here
	@PatchMapping(value = "/{id}", consumes = {"application/json", "application/merge-patch+json"})
	public ResponseEntity<ExpenseDTO> partialUpdateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDTO) {
		log.debug("REST request to partially update Expense : {}, {}", id, expenseDTO);
		validateId(id, expenseDTO);
		return expenseService.partialUpdate(expenseDTO)
				.map(ResponseEntity::ok)
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
	}

	// Paging and sorting: ?page=0&size=20&sort=amount,desc (default: newest expenseDate first)
	@GetMapping
	public ResponseEntity<List<ExpenseDTO>> getAllExpenses(
			ExpenseCriteria criteria,
			@PageableDefault(size = 20, sort = "expenseDate", direction = Sort.Direction.DESC) Pageable pageable) {
		log.debug("REST request to get Expenses by criteria : {}", criteria);
		Page<ExpenseDTO> page = expenseQueryService.findByCriteria(criteria, pageable);
		return ResponseEntity.ok()
				.header(TOTAL_COUNT_HEADER, String.valueOf(page.getTotalElements()))
				.body(page.getContent());
	}

	@GetMapping("/count")
	public ResponseEntity<Long> countExpenses(ExpenseCriteria criteria) {
		log.debug("REST request to count Expenses by criteria : {}", criteria);
		return ResponseEntity.ok(expenseQueryService.countByCriteria(criteria));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ExpenseDTO> getExpense(@PathVariable Long id) {
		log.debug("REST request to get Expense : {}", id);
		return expenseService.findOne(id)
				.map(ResponseEntity::ok)
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
		log.debug("REST request to delete Expense : {}", id);
		expenseService.delete(id);
		return ResponseEntity.noContent().build();
	}

	private void validateId(Long id, ExpenseDTO expenseDTO) {
		if (expenseDTO.getId() == null) {
			throw new BadRequestException("Id must be provided in the body");
		}
		if (!Objects.equals(id, expenseDTO.getId())) {
			throw new BadRequestException("Id in the path and the body do not match");
		}
	}

}
