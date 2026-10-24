package com.fin.wallet.criteria.filter;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

// Bound from query params, e.g. ?category.equals=FOOD or ?category.in=FOOD,TRAVEL
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Filter<T> {

	private T equals;

	private T notEquals;

	// true -> IS NOT NULL, false -> IS NULL
	private Boolean specified;

	private List<T> in;

	private List<T> notIn;

}
