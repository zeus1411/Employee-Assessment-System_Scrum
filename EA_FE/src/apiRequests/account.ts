//////////////////////////////////////////
import http from "@/lib/http";
import {
  UserListResType,
  UserResType,
  CreateUserBodyType,
  UpdateUserBodyType,
  UpdatePasswordBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/api/v1/users";

export interface UserProfileResponse {
  status: number;
  message: string;
  payload: {
    data: {
      user: {
        id: string;
        email: string;
        userName: string;
        role: {
          roleId: string;
          roleName: string;
          description: string;
        };
      };
    };
  };
}

const userApiRequest = {
  list: (page: number = 1, size: number = 10) =>
    http.get<UserListResType>(`${prefix}?current=${page}&pageSize=${size}`),
  add: (body: CreateUserBodyType) => {
    const { confirmPassword, ...requestBody } = body;
    return http.post<UserResType>(prefix, requestBody);
  },
  update: (id: number, body: UpdateUserBodyType) =>
    http.put<UserResType>(`${prefix}/${id}`, body),
  updatePassword: (body: UpdatePasswordBodyType) =>
    http.post<UserResType>(`${prefix}/password`, body),
  get: (id: number) => http.get<UserResType>(`${prefix}/${id}`),
  delete: (id: number) => http.delete<UserResType>(`${prefix}/${id}`),
  me: () => http.get<UserProfileResponse>("/api/v1/auth/account"),
};

export default userApiRequest;
