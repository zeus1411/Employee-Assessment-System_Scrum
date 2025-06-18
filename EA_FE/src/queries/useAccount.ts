// // src/queries/useUser.ts
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import userApiRequest from "@/apiRequests/account";
// import {
//   CreateUserBodyType,
//   UpdateUserBodyType,
//   UpdatePasswordBodyType,
// } from "@/schemaValidations/account.schema";

// export const useGetUserList = (page: number, size: number) => {
//   return useQuery({
//     queryKey: ["users", page, size],
//     queryFn: () => userApiRequest.list(page, size),
//   });
// };

// export const useGetUser = ({
//   id,
//   enabled,
// }: {
//   id: string;
//   enabled: boolean;
// }) => {
//   return useQuery({
//     queryKey: ["users", id],
//     queryFn: () => userApiRequest.get(id),
//     enabled,
//   });
// };

// export const useAddUserMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       body,
//       avatarFile,
//     }: {
//       body: CreateUserBodyType;
//       avatarFile?: File;
//     }) => userApiRequest.add(body, avatarFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

// export const useUpdateUserMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       body,
//       avatarFile,
//     }: {
//       id: string;
//       body: UpdateUserBodyType;
//       avatarFile?: File;
//     }) => userApiRequest.update(id, body, avatarFile),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

// export const useUpdatePasswordMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (body: UpdatePasswordBodyType) =>
//       userApiRequest.updatePassword(body),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

// export const useDeleteUserMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: userApiRequest.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

// export const useAccountProfile = () => {
//   return useQuery({
//     queryKey: ["user-profile"],
//     queryFn: userApiRequest.me,
//   });
// };

////////////////////
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateUserBodyType,
  UpdateUserBodyType,
  UpdatePasswordBodyType,
} from "@/schemaValidations/account.schema";
import userApiRequest from "@/apiRequests/account";

export const useGetUserList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["users", page, size],
    queryFn: () => userApiRequest.list(page, size),
  });
};

export const useGetUser = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApiRequest.get(id),
    enabled,
  });
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserBodyType) => userApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateUserBodyType }) =>
      userApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdatePasswordBodyType) =>
      userApiRequest.updatePassword(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: userApiRequest.me,
  });
};
