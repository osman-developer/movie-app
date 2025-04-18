export interface Filter {
  field: string; // The field to apply the filter on (e.g., 'genre.name', 'movie.title')
  value: any; // The value to match against (e.g. 'action' or 'comedy')
}
