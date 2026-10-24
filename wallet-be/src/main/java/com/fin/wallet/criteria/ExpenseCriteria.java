package com.fin.wallet.criteria;

import com.fin.wallet.criteria.filter.BigDecimalFilter;
import com.fin.wallet.criteria.filter.Filter;
import com.fin.wallet.criteria.filter.LocalDateFilter;
import com.fin.wallet.criteria.filter.LongFilter;
import com.fin.wallet.criteria.filter.StringFilter;
import com.fin.wallet.entity.enums.Currency;
import com.fin.wallet.entity.enums.ExpenseCategory;
import com.fin.wallet.entity.enums.PaymentMethod;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Filters for GET /api/expenses. Every field is optional, examples:
 * <pre>
 * ?userId.equals=1
 * ?category.in=FOOD,GROCERIES
 * ?amount.greaterThanOrEqual=100&amp;amount.lessThan=500
 * ?expenseDate.greaterThanOrEqual=2026-10-01&amp;expenseDate.lessThanOrEqual=2026-10-31
 * ?title.contains=market
 * </pre>
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class ExpenseCriteria {

	// Concrete subclasses so Spring knows which enum to convert the query param into
	public static class CurrencyFilter extends Filter<Currency> {
	}

	public static class ExpenseCategoryFilter extends Filter<ExpenseCategory> {
	}

	public static class PaymentMethodFilter extends Filter<PaymentMethod> {
	}

	private LongFilter id;

	private StringFilter title;

	private StringFilter description;

	private BigDecimalFilter amount;

	private CurrencyFilter currency;

	private ExpenseCategoryFilter category;

	private PaymentMethodFilter paymentMethod;

	private LocalDateFilter expenseDate;

	private LongFilter userId;

}
