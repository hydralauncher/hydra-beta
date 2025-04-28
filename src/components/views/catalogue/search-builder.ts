interface Pagination {
  take: number;
  skip: number;
}

interface Filters {
  title: string;
  genres: string[];
  tags: number[];
  developers: string[];
  publishers: string[];
}

export interface SearchPayload {
  pagination: Pagination;
  filters: Filters;
}
export class SearchBuilder {
  private searchPayload: SearchPayload;

  constructor(pagination: Pagination) {
    this.searchPayload = {
      pagination: {
        take: pagination.take,
        skip: pagination.skip,
      },
      filters: {
        title: "",
        genres: [],
        tags: [],
        developers: [],
        publishers: [],
      },
    };
  }

  setPagination(take: number, skip: number) {
    this.searchPayload.pagination = { take, skip };
  }

  setTitle(title: string) {
    this.searchPayload.filters.title = title;
  }

  setGenres(genre: string) {
    this.searchPayload.filters.genres.push(genre);
  }

  removeGenre(genre: string) {
    this.searchPayload.filters.genres =
      this.searchPayload.filters.genres.filter((g) => g !== genre);
  }

  setUserTags(tag: number) {
    this.searchPayload.filters.tags.push(tag);
  }

  removeUserTag(tag: number) {
    this.searchPayload.filters.tags = this.searchPayload.filters.tags.filter(
      (t) => t !== tag
    );
  }

  setDevelopers(developer: string) {
    this.searchPayload.filters.developers.push(developer);
  }

  removeDeveloper(developer: string) {
    this.searchPayload.filters.developers =
      this.searchPayload.filters.developers.filter((d) => d !== developer);
  }

  setPublishers(publisher: string) {
    this.searchPayload.filters.publishers.push(publisher);
  }

  removePublisher(publisher: string) {
    this.searchPayload.filters.publishers =
      this.searchPayload.filters.publishers.filter((p) => p !== publisher);
  }

  get payload() {
    return this.searchPayload;
  }
}

export class FilterToggle<V extends string | number> {
  private value: V;
  private checked: boolean;
  private setter: (value: V) => void;
  private remover: (value: V) => void;

  constructor(
    value: V,
    checked: boolean,
    setter: (value: V) => void,
    remover: (value: V) => void
  ) {
    this.value = value;
    this.checked = checked;
    this.setter = setter;
    this.remover = remover;
  }

  toggle() {
    if (this.checked) {
      this.setter(this.value);
      return;
    }

    this.remover(this.value);
  }
}
