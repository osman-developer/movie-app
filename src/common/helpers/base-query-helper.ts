import { SelectQueryBuilder } from 'typeorm';
import { Filter } from '../interfaces/local/filter';

export class BaseQueryHelper {
  static apply(
    qb: SelectQueryBuilder<any>,
    options: {
      search?: { term: string; fields: string[] };
      filters?: Filter[]; // Dynamic filters
      pagination?: { page: number; pageSize: number };
    },
  ) {
    // Apply search term (optional)
    if (options.search?.term) {
      const searchConditions = options.search.fields.map(
        (field) => `${field} ILIKE :searchTerm`,
      );
      qb.andWhere(`(${searchConditions.join(' OR ')})`, {
        searchTerm: `%${options.search.term}%`,
      });
    }

    // Apply dynamic filters (supporting nested fields like 'genre.name')
    if (options.filters) {
      options.filters.forEach((filter) => {
        const [field, value] = filter.field.split('.');

        if (field === 'genre' && value === 'name') {
          // Custom handling for genre filtering
          qb.andWhere('genre.name ILIKE :value', {
            value: `%${filter.value}%`,
          });
        } else {
          // Handle other general filters, assuming it's a direct field on movie
          qb.andWhere(`${filter.field} ILIKE :value`, {
            value: `%${filter.value}%`,
          });
        }
      });
    }

    // Apply pagination
    if (options.pagination) {
      const { page, pageSize } = options.pagination;
      qb.skip((page - 1) * pageSize).take(pageSize);
    }
  }
}
