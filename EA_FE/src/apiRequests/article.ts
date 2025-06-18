import http from "@/lib/http";
import {
  ArticleListResType,
  ArticleResType,
  CreateArticleBodyType,
  UpdateArticleBodyType,
} from "@/schemaValidations/article.schema";

const prefix = "/api/v1/articles";

const articleApiRequest = {
  list: (page: number = 1, size: number = 10, search?: string) =>
    http.get<ArticleListResType>(
      `${prefix}?current=${page}&pageSize=${size}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`
    ),
  get: (id: string) => http.get<ArticleResType>(`${prefix}/${id}`),
  add: (body: CreateArticleBodyType) => http.post<ArticleResType>(prefix, body),
  update: (id: string, body: UpdateArticleBodyType) =>
    http.put<ArticleResType>(`${prefix}/${id}`, body),
  delete: (id: string) => http.delete<ArticleResType>(`${prefix}/${id}`),
  toggleLike: (articleId: string, quantity: 1 | -1) =>
    http.post<ArticleResType>(`${prefix}/${articleId}/like`, { quantity }),
};

export default articleApiRequest;
