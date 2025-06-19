import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTeamBodyType,
  UpdateTeamBodyType,
} from "@/schemaValidations/team.schema";
import teamApiRequest from "@/apiRequests/teamApiRequest";

export const useTeamList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["teams", page, size],
    queryFn: () => teamApiRequest.list(page, size),
  });
};

export const useGetTeam = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => teamApiRequest.get(id),
    enabled,
  });
};

export const useAddTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTeamBodyType) => teamApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTeamBodyType }) =>
      teamApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
