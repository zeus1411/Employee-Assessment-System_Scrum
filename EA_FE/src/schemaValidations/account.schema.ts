import { z } from "zod";

export const CreateUserBody = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    userName: z.string().min(1, "Username is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const roleSchema = z.object({
  roleId: z.string(),
});
export const UpdateUserBody = z.object({
  userName: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email").optional(),
  role: roleSchema.optional(),
});

export const UpdatePasswordBody = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type CreateUserBodyType = z.infer<typeof CreateUserBody>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;
export type UpdatePasswordBodyType = z.infer<typeof UpdatePasswordBody>;

export type UserType = {
  userId: number;
  userName: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "No Role Assigned";
};

export type UserResType = {
  status: number;
  message: string;
  payload: {
    data: UserType;
  };
};

export type UserListResType = {
  status: number;
  message: string;
  payload: {
    data: {
      meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
      };
      result: UserType[];
    };
  };
};
