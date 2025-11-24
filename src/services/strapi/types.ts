export interface StrapiResponse<T = any> {
  data: T;
  meta?: StrapiMeta;
}

export interface StrapiCollectionResponse<T = any> {
  data: T[];
  meta: StrapiPaginationMeta;
}

export interface StrapiMeta {
  [key: string]: any;
}

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiEntityAttributes {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  [key: string]: any;
}

export interface StrapiEntity<
  T extends StrapiEntityAttributes = StrapiEntityAttributes,
> {
  id: number;
  attributes: T;
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

export interface StrapiQueryParams {
  populate?: string | string[] | object;
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  locale?: string;
  publicationState?: "live" | "preview";
}
