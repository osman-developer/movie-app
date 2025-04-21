import { PaginationConstants } from '../constants/pagination-constants';
import { Filter } from '../interfaces/local/filter';

export class QueryParamsDto {
  page: number = PaginationConstants.DEFAULT_PAGE;
  pageSize: number = PaginationConstants.DEFAULT_PAGE_SIZE;
  searchTerm?: string;
  filters: Filter[] = [];

  constructor(query: Partial<Record<string, any>> = {}) {
    // Page setup
    const parsedPage = Number(query.page);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      this.page = parsedPage;
    }

    // Page size setup with limits
    const parsedPageSize = Number(query.pageSize);
    if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
      this.pageSize = Math.min(
        parsedPageSize,
        PaginationConstants.MAX_PAGE_SIZE, //to be on safe side to not overload my api if user enters a big nb
      );
    }

    // Search term setup
    if (typeof query.searchTerm === 'string') {
      this.searchTerm = query.searchTerm;
    }

    // Filters setup (parse 'genre.name:Action' to { field: 'genre.name', value: 'Action' })
    if (typeof query.filters === 'string') {
      this.filters = query.filters
        .split(',')
        .map((filterStr: string) => {
          const [field, value] = filterStr.split(':');
          return field && value
            ? { field: field.trim(), value: value.trim() }
            : null;
        })
        .filter((f): f is Filter => f !== null);
    }
  }
}
