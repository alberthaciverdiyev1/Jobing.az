export interface LoginRequest {
  email: string
  password: string
}

export interface UserInfo {
  id: string
  email: string
  name: string
  surname?: string
  roles: string[]
}

export interface AuthResponse {
  token: string
  expiresAt: string
  user: UserInfo
}

export interface City {
  id: string
  name: Record<string, string>
  isActive: boolean
  sortOrder: number
  createdAt: string
  deletedAt?: string
}

export interface CreateCityRequest {
  name: Record<string, string>
  sortOrder: number
}

export interface UpdateCityRequest {
  name: Record<string, string>
  isActive: boolean
  sortOrder: number
}

export interface FilterOption {
  id: string
  filterId: string
  value: string
  name: Record<string, string>
  sortOrder: number
  isActive: boolean
}

export interface Filter {
  id: string
  name: Record<string, string>
  key: string
  options: FilterOption[]
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface CreateFilterRequest {
  name: Record<string, string>
  sortOrder: number
}

export interface UpdateFilterRequest {
  name: Record<string, string>
  sortOrder: number
  isActive: boolean
}

export interface CreateFilterOptionRequest {
  name: Record<string, string>
  sortOrder: number
}

export interface UpdateFilterOptionRequest {
  name: Record<string, string>
  sortOrder: number
  isActive: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  isActive: boolean
  sortOrder: number
  postCount: number
  createdAt: string
}

export interface CreateBlogCategoryRequest {
  name: string
  sortOrder: number
}

export interface UpdateBlogCategoryRequest {
  name: string
  isActive: boolean
  sortOrder: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  coverImage?: string
  authorName?: string
  categoryId?: string
  categoryName?: string
  viewCount: number
  relatedPostIds: string[]
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateBlogPostRequest {
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  authorId?: string
  categoryId?: string
  relatedPostIds: string[]
  isPublished: boolean
}

export interface UpdateBlogPostRequest {
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  relatedPostIds: string[]
  isPublished: boolean
}

export interface User {
  id: string
  email: string
  profile?: { name?: string; surname?: string }
  isActive: boolean
  createdAt: string
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  isActive: boolean
  sortOrder: number
  newsCount: number
  createdAt: string
}

export interface CreateNewsCategoryRequest {
  name: string
  sortOrder: number
}

export interface UpdateNewsCategoryRequest {
  name: string
  isActive: boolean
  sortOrder: number
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  categoryName?: string
  viewCount: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateNewsRequest {
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  isPublished: boolean
}

export interface UpdateNewsRequest {
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  isPublished: boolean
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
