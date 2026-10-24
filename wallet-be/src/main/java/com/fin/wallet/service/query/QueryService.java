package com.fin.wallet.service.query;

import com.fin.wallet.criteria.filter.Filter;
import com.fin.wallet.criteria.filter.RangeFilter;
import com.fin.wallet.criteria.filter.StringFilter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collection;
import java.util.function.Function;

/**
 * Turns Filter objects into JPA Specifications. Extend it once per entity and
 * combine the specifications built here in createSpecification(criteria).
 *
 * @param <E> entity type
 */
public abstract class QueryService<E> {

	protected <X> Specification<E> buildSpecification(Filter<X> filter, SingularAttribute<? super E, X> field) {
		return buildSpecification(filter, root -> root.get(field));
	}

	protected <X> Specification<E> buildSpecification(Filter<X> filter, Function<Root<E>, Expression<X>> path) {
		Specification<E> spec = Specification.unrestricted();
		if (filter.getEquals() != null) {
			spec = spec.and(equalsSpecification(path, filter.getEquals()));
		}
		if (filter.getNotEquals() != null) {
			spec = spec.and(notEqualsSpecification(path, filter.getNotEquals()));
		}
		if (filter.getSpecified() != null) {
			spec = spec.and(specifiedSpecification(path, filter.getSpecified()));
		}
		if (filter.getIn() != null && !filter.getIn().isEmpty()) {
			spec = spec.and(inSpecification(path, filter.getIn()));
		}
		if (filter.getNotIn() != null && !filter.getNotIn().isEmpty()) {
			spec = spec.and(Specification.not(inSpecification(path, filter.getNotIn())));
		}
		return spec;
	}

	protected Specification<E> buildStringSpecification(StringFilter filter, SingularAttribute<? super E, String> field) {
		return buildStringSpecification(filter, root -> root.get(field));
	}

	protected Specification<E> buildStringSpecification(StringFilter filter, Function<Root<E>, Expression<String>> path) {
		Specification<E> spec = buildSpecification(filter, path);
		if (filter.getContains() != null) {
			spec = spec.and(likeSpecification(path, filter.getContains()));
		}
		if (filter.getDoesNotContain() != null) {
			spec = spec.and(Specification.not(likeSpecification(path, filter.getDoesNotContain())));
		}
		return spec;
	}

	protected <X extends Comparable<? super X>> Specification<E> buildRangeSpecification(
			RangeFilter<X> filter, SingularAttribute<? super E, X> field) {
		return buildRangeSpecification(filter, root -> root.get(field));
	}

	protected <X extends Comparable<? super X>> Specification<E> buildRangeSpecification(
			RangeFilter<X> filter, Function<Root<E>, Expression<X>> path) {
		Specification<E> spec = buildSpecification(filter, path);
		if (filter.getGreaterThan() != null) {
			X value = filter.getGreaterThan();
			spec = spec.and((root, query, cb) -> cb.greaterThan(path.apply(root), value));
		}
		if (filter.getGreaterThanOrEqual() != null) {
			X value = filter.getGreaterThanOrEqual();
			spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(path.apply(root), value));
		}
		if (filter.getLessThan() != null) {
			X value = filter.getLessThan();
			spec = spec.and((root, query, cb) -> cb.lessThan(path.apply(root), value));
		}
		if (filter.getLessThanOrEqual() != null) {
			X value = filter.getLessThanOrEqual();
			spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(path.apply(root), value));
		}
		return spec;
	}

	private <X> Specification<E> equalsSpecification(Function<Root<E>, Expression<X>> path, X value) {
		return (root, query, cb) -> cb.equal(path.apply(root), value);
	}

	private <X> Specification<E> notEqualsSpecification(Function<Root<E>, Expression<X>> path, X value) {
		return (root, query, cb) -> cb.notEqual(path.apply(root), value);
	}

	private <X> Specification<E> specifiedSpecification(Function<Root<E>, Expression<X>> path, boolean specified) {
		return (root, query, cb) -> specified ? cb.isNotNull(path.apply(root)) : cb.isNull(path.apply(root));
	}

	private <X> Specification<E> inSpecification(Function<Root<E>, Expression<X>> path, Collection<X> values) {
		return (root, query, cb) -> {
			CriteriaBuilder.In<X> in = cb.in(path.apply(root));
			values.forEach(in::value);
			return in;
		};
	}

	private Specification<E> likeSpecification(Function<Root<E>, Expression<String>> path, String value) {
		return (root, query, cb) -> cb.like(cb.lower(path.apply(root)), "%" + value.toLowerCase() + "%");
	}

}
