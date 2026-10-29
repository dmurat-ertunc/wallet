package com.fin.wallet.dto;

import com.fin.wallet.entity.enums.Currency;
import com.fin.wallet.entity.enums.ExpenseCategory;
import com.fin.wallet.entity.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// What the API sends and receives instead of the Expense entity itself
@Getter
@Setter
@NoArgsConstructor
@ToString
public class ExpenseDTO implements Serializable {

	private Long id;

	@NotBlank
	@Size(max = 100)
	private String title;

	@Size(max = 500)
	private String description;

	@NotNull
	@DecimalMin("0.01")
	@Digits(integer = 13, fraction = 2)
	private BigDecimal amount;

	@NotNull
	private Currency currency;

	@NotNull
	private ExpenseCategory category;

	@NotNull
	private PaymentMethod paymentMethod;

	@NotNull
	private LocalDate expenseDate;

	// Set by the server from the JWT; ignored when sent by the client
	private Long userId;

	// Set by the server; ignored when sent by the client
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

}
