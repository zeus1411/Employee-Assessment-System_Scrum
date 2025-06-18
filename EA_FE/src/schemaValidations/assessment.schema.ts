import { z } from "zod";

export const AssessmentCriteriaSchema = z.object({
  assessmentCriteriaId: z.number(),
  criteriaName: z.string().min(1, "Criteria name is required"),
  description: z.string().min(1, "Description is required"),
});

export const CreateAssessmentBody = z.object({
  criteriaName: z.string().min(1, "Criteria name is required"),
  description: z.string().min(1, "Description is required"),
});

export const UpdateAssessmentBody = CreateAssessmentBody;

export type AssessmentCriteriaType = z.infer<typeof AssessmentCriteriaSchema>;
export type CreateAssessmentBodyType = z.infer<typeof CreateAssessmentBody>;
export type UpdateAssessmentBodyType = z.infer<typeof UpdateAssessmentBody>;

export type AssessmentListResType = {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: AssessmentCriteriaType[];
  };
};

export type AssessmentResType = {
  statusCode: number;
  error: string | null;
  message: string;
  data: AssessmentCriteriaType;
};
