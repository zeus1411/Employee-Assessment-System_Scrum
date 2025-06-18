import http from "@/lib/http";
import {
  AssessmentListResType,
  AssessmentResType,
  CreateAssessmentBodyType,
  UpdateAssessmentBodyType,
} from "@/schemaValidations/assessment.schema";

const PREFIX = "/api/v1/assessment-criteria";

const assessmentApiRequest = {
  list: (page: number = 1, pageSize: number = 20) =>
    http.get<AssessmentListResType>(
      `${PREFIX}?current=${page}&pageSize=${pageSize}`
    ),
  get: (id: number) => http.get<AssessmentResType>(`${PREFIX}/${id}`),
  add: (body: CreateAssessmentBodyType) =>
    http.post<AssessmentResType>(PREFIX, body),
  update: (id: number, body: UpdateAssessmentBodyType) =>
    http.put<AssessmentResType>(`${PREFIX}/${id}`, body),
  delete: (id: number) => http.delete<AssessmentResType>(`${PREFIX}/${id}`),
};

export default assessmentApiRequest;
