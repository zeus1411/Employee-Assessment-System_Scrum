import http from "@/lib/http";
import {
  CreateTeamBodyType,
  TeamListResType,
  TeamMemberListResType,
  UpdateTeamBodyType,
} from "@/schemaValidations/team.schema";

const PREFIX = "/api/v1/teams";

const teamApiRequest = {
  list: (page: number = 1, pageSize: number = 20) =>
    http.get<TeamListResType>(`${PREFIX}?current=${page}&pageSize=${pageSize}`),
  get: (id: number) => http.get<TeamListResType>(`${PREFIX}/${id}`),
  add: (body: CreateTeamBodyType) => http.post<TeamListResType>(PREFIX, body),
  update: (id: number, body: UpdateTeamBodyType) =>
    http.put<TeamListResType>(`${PREFIX}/${id}`, body),
  delete: (id: number) => http.delete<TeamListResType>(`${PREFIX}/${id}`),
  getAllUser: (id: number) => http.delete<TeamListResType>(`${PREFIX}/${id}`),
  getTeamMembers: (teamId: number, page: number = 1, pageSize: number = 20) =>
    http.get<TeamMemberListResType>(
      `${PREFIX}/members/${teamId}?current=${page}&pageSize=${pageSize}`
    ),
};

export default teamApiRequest;
