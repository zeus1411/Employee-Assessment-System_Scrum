import { z } from "zod";

// Định nghĩa type cho Member trong Team
export const TeamMember = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.string().email("Invalid email format"),
});

// Định nghĩa type cho Supervisor
export const Supervisor = z.object({
  supervisorId: z.string(),
  supervisorName: z.string(),
});

// Định nghĩa type cơ bản cho Team (dùng cho tạo và cập nhật)
export const TeamBase = z.object({
  teamName: z.string().min(1, "Team name is required"),
  supervisor: Supervisor, // Thay supervisorId bằng object Supervisor
  memberIds: z.array(z.number()).min(1, "At least one member is required"), // Giữ nguyên để tương thích với CreateTeamBody
  members: z.array(TeamMember).optional(), // Thêm members để phản ánh dữ liệu từ API, optional vì không yêu cầu khi tạo
});

// Schema cho việc tạo mới Team (giữ nguyên logic cũ)
export const CreateTeamBody = TeamBase.pick({
  teamName: true,
  supervisor: true,
  memberIds: true,
}).strict(); // Chỉ cho phép các trường được chọn, loại bỏ members

// Schema cho việc cập nhật Team (giữ nguyên logic cũ)
export const UpdateTeamBody = CreateTeamBody.partial().strict(); // Cho phép các trường tùy chọn

// Schema cho phản hồi từ API (bao gồm teamId từ server)
export const TeamRes = TeamBase.extend({
  teamId: z.number(),
}).strict();

// Schema cho danh sách Teams từ API
export const TeamListRes = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: z.object({
    meta: z.object({
      page: z.number(),
      pageSize: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(TeamRes),
  }),
});

// Type exports
export type CreateTeamBodyType = z.infer<typeof CreateTeamBody>;
export type UpdateTeamBodyType = z.infer<typeof UpdateTeamBody>;
export type TeamType = z.infer<typeof TeamRes>; // Sử dụng TeamRes làm TeamType
export type TeamListResType = z.infer<typeof TeamListRes>;

// Type cho MemberList (nếu cần tách riêng)
export type TeamMemberType = z.infer<typeof TeamMember>;
