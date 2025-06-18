import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateAssessmentBodyType,
  UpdateAssessmentBodyType,
} from "@/schemaValidations/assessment.schema";
import assessmentApiRequest from "@/apiRequests/assessment";

export const useAssessmentList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["assessmentCriteria", page, size],
    queryFn: () => assessmentApiRequest.list(page, size),
  });
};

export const useGetAssessment = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["assessmentCriteria", id],
    queryFn: () => assessmentApiRequest.get(id),
    enabled,
  });
};

export const useAddAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAssessmentBodyType) =>
      assessmentApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessmentCriteria"] });
    },
  });
};

export const useUpdateAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateAssessmentBodyType;
    }) => assessmentApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessmentCriteria"] });
    },
  });
};

export const useDeleteAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assessmentApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessmentCriteria"] });
    },
  });
};
