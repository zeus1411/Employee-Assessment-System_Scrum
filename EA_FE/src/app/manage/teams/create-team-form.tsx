"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  CreateTeamBodyType,
  CreateTeamBody,
} from "@/schemaValidations/team.schema";
import { useAddTeamMutation } from "@/queries/useTeam";
import { useGetUserList } from "@/queries/useAccount"; // Sử dụng hook để lấy danh sách người dùng

type CreateTeamProps = {
  onSubmitSuccess?: () => void;
};

export default function CreateTeam({ onSubmitSuccess }: CreateTeamProps) {
  const t = useTranslations("ManageTeams");
  const [open, setOpen] = useState(false);
  const addTeamMutation = useAddTeamMutation();

  // Lấy danh sách người dùng
  const userListQuery = useGetUserList(1, 100); // Lấy tất cả người dùng (page 1, pageSize lớn)
  console.log("asdasdasd", userListQuery.data);
  const users = userListQuery.data?.payload.data.result ?? [];

  const form = useForm<CreateTeamBodyType>({
    resolver: zodResolver(CreateTeamBody),
    defaultValues: {
      teamName: "",
      supervisorId: "",
      memberIds: [],
    },
  });

  const reset = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (values: CreateTeamBodyType) => {
    if (addTeamMutation.isPending) return;
    try {
      await addTeamMutation.mutateAsync(values);
      toast({
        description: t("CreateSuccess", { teamName: values.teamName }),
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({ description: t("CreateError"), variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("CreateTeam")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateTeam")}</DialogTitle>
          <DialogDescription>{t("CreateDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-team-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("TeamName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("TeamNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("SupervisorID")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("SupervisorIDPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Members")}</FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {userListQuery.isLoading ? (
                        <p>{t("Loading")}</p>
                      ) : userListQuery.isError ? (
                        <p className="text-red-500">{t("ErrorLoadingUsers")}</p>
                      ) : (
                        users.map((user) => (
                          <div
                            key={user.userId}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`user-${user.userId}`}
                              value={user.userId}
                              checked={field.value.includes(user.userId)}
                              onChange={(e) => {
                                const newMemberIds = e.target.checked
                                  ? [...field.value, user.userId]
                                  : field.value.filter(
                                      (id) => id !== user.userId
                                    );
                                field.onChange(newMemberIds);
                              }}
                            />
                            <label htmlFor={`user-${user.userId}`}>
                              {user.userName} (ID: {user.userId})
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-team-form"
            disabled={addTeamMutation.isPending || userListQuery.isLoading}
          >
            {addTeamMutation.isPending || userListQuery.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Submitting")}
              </>
            ) : (
              t("Create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
