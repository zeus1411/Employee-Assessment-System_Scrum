// // "use client";
// // import { useEffect } from "react";
// // import { useTranslations } from "next-intl";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { toast } from "@/components/ui/use-toast";
// // import { handleErrorApi } from "@/lib/utils";
// // import {
// //   Form,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormControl,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Loader2 } from "lucide-react";
// // import {
// //   CreateTeamBody,
// //   UpdateTeamBodyType,
// // } from "@/schemaValidations/team.schema";
// // import { useGetTeam, useUpdateTeamMutation } from "@/queries/useTeam";

// // type EditTeamProps = {
// //   id: number | undefined;
// //   setId: (value: number | undefined) => void;
// //   onSubmitSuccess?: () => void;
// // };

// // export default function EditTeam({
// //   id,
// //   setId,
// //   onSubmitSuccess,
// // }: EditTeamProps) {
// //   const t = useTranslations("ManageTeams");
// //   const { data, isLoading } = useGetTeam({ id: id || 0, enabled: !!id });
// //   const updateTeamMutation = useUpdateTeamMutation();

// //   const form = useForm<UpdateTeamBodyType>({
// //     resolver: zodResolver(CreateTeamBody),
// //     defaultValues: {
// //       teamName: "",
// //       supervisorId: "",
// //       memberIds: [],
// //     },
// //   });

// //   useEffect(() => {
// //     if (data) {
// //       const { teamName, supervisorId, memberIds } = data.payload.data;
// //       form.reset({ teamName, supervisorId, memberIds });
// //     }
// //   }, [data, form]);

// //   const reset = () => {
// //     form.reset();
// //     setId(undefined);
// //   };

// //   const onSubmit = async (values: UpdateTeamBodyType) => {
// //     if (updateTeamMutation.isPending || !id) return;
// //     try {
// //       await updateTeamMutation.mutateAsync({ id, body: values });
// //       toast({
// //         description: t("UpdateSuccess", { teamName: values.teamName }),
// //       });
// //       reset();
// //       onSubmitSuccess?.();
// //     } catch (error) {
// //       handleErrorApi({ error, setError: form.setError });
// //       toast({ description: t("UpdateError"), variant: "destructive" });
// //     }
// //   };

// //   return (
// //     <Dialog
// //       open={Boolean(id)}
// //       onOpenChange={(value) => {
// //         if (!value) reset();
// //       }}
// //     >
// //       <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
// //         <DialogHeader>
// //           <DialogTitle>{t("UpdateTeam")}</DialogTitle>
// //         </DialogHeader>
// //         {isLoading ? (
// //           <div className="flex items-center justify-center p-4">
// //             <Loader2 className="h-6 w-6 animate-spin" />
// //             <span className="ml-2">{t("Loading")}</span>
// //           </div>
// //         ) : (
// //           <Form {...form}>
// //             <form
// //               id="edit-team-form"
// //               onSubmit={form.handleSubmit(onSubmit)}
// //               className="grid gap-4 py-4"
// //             >
// //               <FormField
// //                 control={form.control}
// //                 name="teamName"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>{t("TeamName")}</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         placeholder={t("TeamNamePlaceholder")}
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="supervisorId"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>{t("SupervisorID")}</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         placeholder={t("SupervisorIDPlaceholder")}
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="memberIds"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>{t("Members")}</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         placeholder={t("MemberIdsPlaceholder")}
// //                         value={field.value.join(", ")}
// //                         onChange={(e) =>
// //                           field.onChange(e.target.value.split(",").map(Number))
// //                         }
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </form>
// //           </Form>
// //         )}
// //         <DialogFooter>
// //           <Button
// //             type="submit"
// //             form="edit-team-form"
// //             disabled={updateTeamMutation.isPending || isLoading}
// //           >
// //             {updateTeamMutation.isPending ? (
// //               <>
// //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                 {t("Submitting")}
// //               </>
// //             ) : (
// //               t("Update")
// //             )}
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// ////////////////////
// "use client";
// import { useEffect } from "react";
// import { useTranslations } from "next-intl";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast";
// import { handleErrorApi } from "@/lib/utils";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import {
//   CreateTeamBody,
//   UpdateTeamBodyType,
//   TeamType,
// } from "@/schemaValidations/team.schema";
// import { useGetTeam, useUpdateTeamMutation } from "@/queries/useTeam";
// import { useGetUserList } from "@/queries/useAccount"; // Thêm để lấy danh sách người dùng

// type EditTeamProps = {
//   id: number | undefined;
//   setId: (value: number | undefined) => void;
//   onSubmitSuccess?: () => void;
// };

// export default function EditTeam({
//   id,
//   setId,
//   onSubmitSuccess,
// }: EditTeamProps) {
//   const t = useTranslations("ManageTeams");
//   const { data, isLoading } = useGetTeam({ id: id || 0, enabled: !!id });
//   const updateTeamMutation = useUpdateTeamMutation();

//   // Lấy danh sách người dùng để chọn supervisor và members
//   const userListQuery = useGetUserList(1, 100);
//   const users = userListQuery.data?.payload.data.result ?? [];

//   const form = useForm<UpdateTeamBodyType>({
//     resolver: zodResolver(CreateTeamBody), // Sử dụng CreateTeamBody để validate
//     defaultValues: {
//       teamName: "",
//       supervisor: { supervisorId: "", supervisorName: "" }, // Cập nhật thành object
//       memberIds: [], // Giữ nguyên để tương thích với CreateTeamBody
//     },
//   });

//   useEffect(() => {
//     if (data) {
//       const teamData = data.payload.data as TeamType;
//       form.reset({
//         teamName: teamData.teamName,
//         supervisor: {
//           supervisorId: teamData.supervisor.supervisorId.toString(), // Chuyển sang string để khớp Input
//           supervisorName: teamData.supervisor.supervisorName,
//         },
//         memberIds: teamData.members.map((member) => member.userId), // Lấy userId từ members
//       });
//     }
//   }, [data, form]);

//   const reset = () => {
//     form.reset();
//     setId(undefined);
//   };

//   const onSubmit = async (values: UpdateTeamBodyType) => {
//     if (updateTeamMutation.isPending || !id) return;
//     try {
//       // Chuyển supervisorId về số trước khi gửi
//       const updatedValues = {
//         ...values,
//         supervisor: {
//           ...values.supervisor,
//           supervisorId: Number(values.supervisor.supervisorId),
//         },
//       };
//       await updateTeamMutation.mutateAsync({ id, body: updatedValues });
//       toast({
//         description: t("UpdateSuccess", { teamName: values.teamName }),
//       });
//       reset();
//       onSubmitSuccess?.();
//     } catch (error) {
//       handleErrorApi({ error, setError: form.setError });
//       toast({ description: t("UpdateError"), variant: "destructive" });
//     }
//   };

//   return (
//     <Dialog
//       open={Boolean(id)}
//       onOpenChange={(value) => {
//         if (!value) reset();
//       }}
//     >
//       <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
//         <DialogHeader>
//           <DialogTitle>{t("UpdateTeam")}</DialogTitle>
//         </DialogHeader>
//         {isLoading || userListQuery.isLoading ? (
//           <div className="flex items-center justify-center p-4">
//             <Loader2 className="h-6 w-6 animate-spin" />
//             <span className="ml-2">{t("Loading")}</span>
//           </div>
//         ) : (
//           <Form {...form}>
//             <form
//               id="edit-team-form"
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="grid gap-4 py-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="teamName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("TeamName")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder={t("TeamNamePlaceholder")}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="supervisor.supervisorId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("SupervisorID")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder={t("SupervisorIDPlaceholder")}
//                         {...field}
//                         value={field.value || ""}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="memberIds"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("Members")}</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2 max-h-40 overflow-y-auto">
//                         {users.map((user) => (
//                           <div
//                             key={user.userId}
//                             className="flex items-center space-x-2"
//                           >
//                             <input
//                               type="checkbox"
//                               id={`user-${user.userId}`}
//                               value={user.userId}
//                               checked={field.value.includes(user.userId)}
//                               onChange={(e) => {
//                                 const newMemberIds = e.target.checked
//                                   ? [...field.value, user.userId]
//                                   : field.value.filter(
//                                       (id) => id !== user.userId
//                                     );
//                                 field.onChange(newMemberIds);
//                               }}
//                             />
//                             <label htmlFor={`user-${user.userId}`}>
//                               {user.userName} (ID: {user.userId})
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </form>
//           </Form>
//         )}
//         <DialogFooter>
//           <Button
//             type="submit"
//             form="edit-team-form"
//             disabled={
//               updateTeamMutation.isPending ||
//               isLoading ||
//               userListQuery.isLoading
//             }
//           >
//             {updateTeamMutation.isPending ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {t("Submitting")}
//               </>
//             ) : (
//               t("Update")
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";
import { useEffect } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  CreateTeamBody,
  UpdateTeamBodyType,
  TeamType,
} from "@/schemaValidations/team.schema";
import { useGetTeam, useUpdateTeamMutation } from "@/queries/useTeam";
import { useGetUserList } from "@/queries/useAccount";

type EditTeamProps = {
  id: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditTeam({
  id,
  setId,
  onSubmitSuccess,
}: EditTeamProps) {
  const t = useTranslations("ManageTeams");
  const { data, isLoading } = useGetTeam({ id: id || 0, enabled: !!id });
  const updateTeamMutation = useUpdateTeamMutation();

  const userListQuery = useGetUserList(1, 100);
  const users = userListQuery.data?.payload.data.result ?? [];

  const form = useForm<UpdateTeamBodyType>({
    resolver: zodResolver(CreateTeamBody),
    defaultValues: {
      teamName: "",
      supervisor: { supervisorId: "", supervisorName: "" },
      memberIds: [],
    },
  });

  useEffect(() => {
    if (data) {
      const teamData = data.payload.data as TeamType;
      console.log("data get by id", teamData);
      form.reset({
        teamName: teamData.teamName,
        supervisor: {
          supervisorId: teamData.supervisor.supervisorId, // Giữ string để khớp Input
          supervisorName: teamData.supervisor.supervisorName,
        },
        memberIds: teamData.members.map((member) => member.userId), // Đảm bảo là number
      });
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  const onSubmit = async (values: UpdateTeamBodyType) => {
    if (updateTeamMutation.isPending || !id) return;
    try {
      // Chuyển đổi supervisorId từ string sang number
      const updatedValues = {
        ...values,
        supervisor: {
          ...values.supervisor,
          supervisorId: Number(values.supervisor.supervisorId), // Chuyển đổi tại đây
        },
        memberIds: values.memberIds.map((id) => Number(id)), // Đảm bảo memberIds là number
      };
      await updateTeamMutation.mutateAsync({ id, body: updatedValues });
      toast({
        description: t("UpdateSuccess", { teamName: values.teamName }),
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({ description: t("UpdateError"), variant: "destructive" });
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) reset();
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("UpdateTeam")}</DialogTitle>
        </DialogHeader>
        {isLoading || userListQuery.isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t("Loading")}</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              id="edit-team-form"
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
                      <Input
                        placeholder={t("TeamNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supervisor.supervisorId.userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("SupervisorID")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("SupervisorIDPlaceholder")}
                        {...field}
                        value={field.value || ""}
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
                        {users.map((user) => (
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
                                field.onChange(newMemberIds); // Giá trị đã là number từ user.userId
                              }}
                            />
                            <label htmlFor={`user-${user.userId}`}>
                              {user.userName} (ID: {user.userId})
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
        <DialogFooter>
          <Button
            type="submit"
            form="edit-team-form"
            disabled={
              updateTeamMutation.isPending ||
              isLoading ||
              userListQuery.isLoading
            }
          >
            {updateTeamMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Submitting")}
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
