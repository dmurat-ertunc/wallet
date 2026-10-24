package com.fin.wallet.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

/**
 * Base contract for every DTO <-> entity mapper.
 *
 * @param <D> DTO type
 * @param <E> entity type
 */
public interface EntityMapper<D, E> {

	E toEntity(D dto);

	D toDto(E entity);

	List<E> toEntity(List<D> dtoList);

	List<D> toDto(List<E> entityList);

	// PUT: copies every field, nulls included
	void update(@MappingTarget E entity, D dto);

	// PATCH: copies only the fields that are not null in the DTO
	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	void partialUpdate(@MappingTarget E entity, D dto);

}
