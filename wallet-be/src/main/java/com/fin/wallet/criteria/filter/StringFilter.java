package com.fin.wallet.criteria.filter;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// Case-insensitive search, e.g. ?title.contains=market
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class StringFilter extends Filter<String> {

	private String contains;

	private String doesNotContain;

}
