// "use client";
// import { useState, useEffect } from "react";
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
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";
// import {
//   UpdateUserBodyType,
//   UpdateUserBody,
// } from "@/schemaValidations/account.schema";
// import { useGetUser, useUpdateUserMutation } from "@/queries/useAccount";

// type EditUserProps = {
//   id: number | undefined;
//   setId: (value: number | undefined) => void;
//   onSubmitSuccess?: () => void;
// };

// const ROLES = ["ADMIN", "SUPERVISOR", "No Role Assigned"] as const;

// export default function EditUser({
//   id,
//   setId,
//   onSubmitSuccess,
// }: EditUserProps) {
//   const t = useTranslations("ManageUsers");
//   const [open, setOpen] = useState(!!id);

//   const { data, isLoading } = useGetUser({ id: id || 0, enabled: !!id });
//   const updateUserMutation = useUpdateUserMutation();

//   const form = useForm<UpdateUserBodyType>({
//     resolver: zodResolver(UpdateUserBody),
//     defaultValues: {
//       userName: "",
//       email: "",
//       role: "No Role Assigned",
//     },
//   });

//   useEffect(() => {
//     if (data?.payload.data) {
//       const { userName, email, role } = data.payload.data;
//       form.reset({ userName, email, role });
//     }
//   }, [data, form]);

//   const reset = () => {
//     form.reset();
//     setId(undefined);
//     setOpen(false);
//   };

//   const onSubmit = async (values: UpdateUserBodyType) => {
//     if (updateUserMutation.isPending || !id) return;
//     try {
//       await updateUserMutation.mutateAsync({ id, body: values });
//       toast({
//         description: t("UpdateSuccess", { email: data?.payload.data.email }),
//       });
//       reset();
//       onSubmitSuccess?.();
//     } catch (error) {
//       handleErrorApi({ error, setError: form.setError });
//       toast({
//         description: t("UpdateError"),
//         variant: "destructive",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-4">
//         <Loader2 className="h-6 w-6 animate-spin" />
//         <span className="ml-2">{t("Loading")}</span>
//       </div>
//     );
//   }

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(value) => {
//         setOpen(value);
//         if (!value) reset();
//       }}
//     >
//       <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
//         <DialogHeader>
//           <DialogTitle>{t("UpdateUser")}</DialogTitle>
//           <DialogDescription>{t("UpdateDescription")}</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             id="edit-user-form"
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid gap-4 py-4"
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Email")}</FormLabel>
//                   <Input placeholder={t("EmailPlaceholder")} {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="userName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Username")}</FormLabel>
//                   <Input placeholder={t("UsernamePlaceholder")} {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Role")}</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={t("SelectRole")} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {ROLES.map((role) => (
//                         <SelectItem key={role} value={role}>
//                           {t(role)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button
//             type="submit"
//             form="edit-user-form"
//             disabled={updateUserMutation.isPending}
//           >
//             {updateUserMutation.isPending ? (
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

///////////////////////////================
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  UpdateUserBodyType,
  UpdateUserBody,
} from "@/schemaValidations/account.schema";
import { useGetUser, useUpdateUserMutation } from "@/queries/useAccount";

type EditUserProps = {
  id: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditUser({
  id,
  setId,
  onSubmitSuccess,
}: EditUserProps) {
  const t = useTranslations("ManageUsers");
  const { data, isLoading } = useGetUser({ id: id || 0, enabled: !!id });
  const updateUserMutation = useUpdateUserMutation();

  const form = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBody),
    defaultValues: {
      userName: "",
      email: "",
      role: {
        roleId: "1",
      },
    },
  });

  useEffect(() => {
    if (data?.payload.data) {
      const { userName, email, role } = data.payload.data;
      form.reset({ userName, email, role });
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  const onSubmit = async (values: UpdateUserBodyType) => {
    if (updateUserMutation.isPending || !id) return;
    try {
      await updateUserMutation.mutateAsync({ id, body: values });
      toast({
        description: t("UpdateSuccess", { email: values.email }),
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({
        description: t("UpdateError"),
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          reset();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("UpdateUser")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t("Loading")}</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              id="edit-user-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form errors:", errors);
              })}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("EmailPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Username")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("UsernamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role.roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Role")}</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("SelectRole")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="admin" value="1">
                          ADMIN
                        </SelectItem>
                        <SelectItem key="supervisor" value="2">
                          SUPERVISOR
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
            form="edit-user-form"
            disabled={updateUserMutation.isPending || isLoading}
          >
            {updateUserMutation.isPending ? (
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
