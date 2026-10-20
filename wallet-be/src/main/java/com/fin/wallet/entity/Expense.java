package com.fin.wallet.entity;

import com.fin.wallet.entity.enums.Currency;
import com.fin.wallet.entity.enums.ExpenseCategory;
import com.fin.wallet.entity.enums.PaymentMethod;
import com.fin.wallet.entity.enums.RecurrencePeriod;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "user")
@Entity
@Table(name = "expenses", indexes = {
		@Index(name = "idx_expenses_user_id", columnList = "user_id"),
		@Index(name = "idx_expenses_user_date", columnList = "user_id, expense_date")
})
public class Expense extends BaseEntity {

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "description", length = 500)
	private String description;

	@Column(name = "amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	@Column(name = "currency", nullable = false, length = 3)
	private Currency currency = Currency.TRY;

	@Enumerated(EnumType.STRING)
	@Column(name = "category", nullable = false, length = 30)
	private ExpenseCategory category;

	@Enumerated(EnumType.STRING)
	@Column(name = "payment_method", nullable = false, length = 30)
	private PaymentMethod paymentMethod;

	@Column(name = "expense_date", nullable = false)
	private LocalDate expenseDate;

//	@ManyToOne	"Çoktan bire": birçok harcama tek bir kullanıcıya bağlanır.
//	fetch = FetchType.LAZY	Bir harcamayı okuduğunda kullanıcısı hemen yüklenmez. Kodda expense.getUser().getFirstName() gibi kullanıcıya ilk eriştiğin anda yüklenir. Gereksiz sorguları önler. Varsayılan değer EAGER, yani her harcamayla birlikte kullanıcı da hemen yüklenir. Bu yüzden LAZY'yi açıkça yazdık.
//	optional = false	Kullanıcısı olmayan bir harcamayı Java tarafında kabul etmez.
//	@JoinColumn(name = "user_id")	Bağlantıyı tutan kolonun adı user_id olur.
//	nullable = false	Veritabanında user_id kolonu NOT NULL olur, kolon boş bırakılamaz.
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

}
