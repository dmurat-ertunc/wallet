package com.fin.wallet.service.query;

import com.fin.wallet.criteria.ExpenseCriteria;
import com.fin.wallet.dto.ExpenseDTO;
import com.fin.wallet.entity.BaseEntity_;
import com.fin.wallet.entity.Expense;
import com.fin.wallet.entity.Expense_;
import com.fin.wallet.mapper.ExpenseMapper;
import com.fin.wallet.repository.ExpenseRepository;
import com.fin.wallet.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Expense_ and BaseEntity_ are JPA metamodel classes generated at compile time by hibernate-processor.
// Results are always limited to the user in the JWT, whatever filters the client sends.
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ExpenseQueryService extends QueryService<Expense> {

	private final ExpenseRepository expenseRepository;

	private final ExpenseMapper expenseMapper;

	private final CurrentUserService currentUserService;

	public Page<ExpenseDTO> findByCriteria(ExpenseCriteria criteria, Pageable pageable) {
		log.debug("find by criteria : {}, page: {}", criteria, pageable);
		return expenseRepository.findAll(createOwnSpecification(criteria), pageable).map(expenseMapper::toDto);
	}

	public long countByCriteria(ExpenseCriteria criteria) {
		log.debug("count by criteria : {}", criteria);
		return expenseRepository.count(createOwnSpecification(criteria));
	}

	// The client's filters AND "belongs to the current user"
	private Specification<Expense> createOwnSpecification(ExpenseCriteria criteria) {
		Long userId = currentUserService.getCurrentUser().getId();
		// Reads the user_id foreign key directly, no join to the users table
		Specification<Expense> ownedByCurrentUser =
				(root, query, cb) -> cb.equal(root.get(Expense_.user).get(BaseEntity_.id), userId);
		return createSpecification(criteria).and(ownedByCurrentUser);
	}

	protected Specification<Expense> createSpecification(ExpenseCriteria criteria) {
		Specification<Expense> spec = Specification.unrestricted();
		if (criteria == null) {
			return spec;
		}
		if (criteria.getId() != null) {
			spec = spec.and(buildRangeSpecification(criteria.getId(), BaseEntity_.id));
		}
		if (criteria.getTitle() != null) {
			spec = spec.and(buildStringSpecification(criteria.getTitle(), Expense_.title));
		}
		if (criteria.getDescription() != null) {
			spec = spec.and(buildStringSpecification(criteria.getDescription(), Expense_.description));
		}
		if (criteria.getAmount() != null) {
			spec = spec.and(buildRangeSpecification(criteria.getAmount(), Expense_.amount));
		}
		if (criteria.getCurrency() != null) {
			spec = spec.and(buildSpecification(criteria.getCurrency(), Expense_.currency));
		}
		if (criteria.getCategory() != null) {
			spec = spec.and(buildSpecification(criteria.getCategory(), Expense_.category));
		}
		if (criteria.getPaymentMethod() != null) {
			spec = spec.and(buildSpecification(criteria.getPaymentMethod(), Expense_.paymentMethod));
		}
		if (criteria.getExpenseDate() != null) {
			spec = spec.and(buildRangeSpecification(criteria.getExpenseDate(), Expense_.expenseDate));
		}
		return spec;
	}

}
