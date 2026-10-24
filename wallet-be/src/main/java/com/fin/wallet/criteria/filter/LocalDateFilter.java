package com.fin.wallet.criteria.filter;

import java.time.LocalDate;

// Expects ISO dates (2026-10-24), configured by spring.mvc.format.date in application.yaml
public class LocalDateFilter extends RangeFilter<LocalDate> {
}
