package com.fin.wallet.entity;

import com.fin.wallet.entity.enums.Currency;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// "user" is a reserved word in PostgreSQL, so the table is named "users"
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"password", "expenses"})
@Entity
@Table(name = "users")
public class User extends BaseEntity {

	@Column(name = "first_name", nullable = false, length = 50)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 50)
	private String lastName;

	// Giriş için kullanılacak benzersiz kullanıcı adı.
	// Şimdilik boş bırakılabilir: tabloda zaten kayıtlı kullanıcılar var ve ddl-auto: update,
	// dolu bir tabloya varsayılan değeri olmayan NOT NULL kolon ekleyemez. Mevcut kayıtlara
	// kullanıcı adı verildikten sonra nullable = false yapılabilir.
	@Column(name = "user_name", unique = true, length = 50)
	private String userName;

	@Column(name = "email", nullable = false, unique = true, length = 100)
	private String email;

	// Stores the hashed password, never the plain text
	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "phone_number", length = 20)
	private String phoneNumber;

	@Enumerated(EnumType.STRING)
	@Column(name = "default_currency", nullable = false, length = 3)
	private Currency defaultCurrency = Currency.TRY;

	@Column(name = "monthly_budget", precision = 15, scale = 2)
	private BigDecimal monthlyBudget;

	@Column(name = "active", nullable = false)
	private boolean active = true;

//	@OneToMany	"Birden çoğa": bir kullanıcının birden çok harcaması olabilir.
//	mappedBy = "user"	"Bu ilişkinin sahibi Expense sınıfındaki user alanı, bağlantıyı orada ara" demek. Bu satır olmasaydı Hibernate ilişkiyi ayrı sanır ve gereksiz bir ara tablo (users_expenses) oluştururdu.
//	cascade = CascadeType.ALL	Kullanıcıya yapılan işlemler harcamalarına da uygulanır. Kullanıcıyı kaydedersen listedeki yeni harcamalar da kaydedilir. Kullanıcıyı silersen harcamaları da silinir.
//			orphanRemoval = true	Bir harcamayı listeden çıkarırsan (user.removeExpense(expense)) o harcama veritabanından da silinir. Bunun sebebi kullanıcısı olmayan bir harcamanın anlamsız olması ("yetim" kalması).
//			= new ArrayList<>()	Liste boş başlar. Böylece hiç harcaması olmayan kullanıcıda getExpenses() null yerine boş liste döner ve NullPointerException almazsın.
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Expense> expenses = new ArrayList<>();

	public void addExpense(Expense expense) {
		expenses.add(expense);
		expense.setUser(this);
	}

	public void removeExpense(Expense expense) {
		expenses.remove(expense);
		expense.setUser(null);
	}

}
