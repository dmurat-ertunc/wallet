package com.fin.wallet.criteria.filter;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// Adds comparisons, e.g. ?amount.greaterThanOrEqual=100&amount.lessThan=500
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class RangeFilter<T extends Comparable<? super T>> extends Filter<T> {

	private T greaterThan;

	private T greaterThanOrEqual;

	private T lessThan;

	private T lessThanOrEqual;

}
