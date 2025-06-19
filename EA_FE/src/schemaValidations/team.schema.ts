// team.schema.ts
import { z } from "zod";

// Định nghĩa type cơ bản cho Team
export const TeamBase = z.object({
  teamName: z.string().min(1, "Team name is required"),
  supervisorId: z.string().min(1, "Supervisor ID is required"),
  memberIds: z.array(z.number()).min(1, "At least one member is required"),
});

// Schema cho việc tạo mới Team
export const CreateTeamBody = TeamBase;

// Schema cho việc cập nhật Team
export const UpdateTeamBody = TeamBase.extend({
  // Có thể thêm các trường tùy chọn nếu cần (ví dụ: chỉ cập nhật một phần)
  // Hiện tại giữ nguyên như CreateTeamBody để đơn giản
});

// Schema cho phản hồi từ API (bao gồm teamId từ server)
export const TeamRes = TeamBase.extend({
  teamId: z.number(),
});

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
