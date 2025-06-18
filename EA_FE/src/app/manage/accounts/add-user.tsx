"use client";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  CreateUserBodyType,
  CreateUserBody,
} from "@/schemaValidations/account.schema";
import { useAddUserMutation } from "@/queries/useAccount";

type CreateUserProps = {
  onSubmitSuccess?: () => void;
};

export default function CreateUser({ onSubmitSuccess }: CreateUserProps) {
  const t = useTranslations("ManageUsers");
  const [open, setOpen] = useState(false);

  const addUserMutation = useAddUserMutation();

  const form = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userName: "",
    },
  });

  const reset = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (values: CreateUserBodyType) => {
    if (addUserMutation.isPending) return;
    try {
      await addUserMutation.mutateAsync(values);
      toast({
        description: t("CreateSuccess", { email: values.email }),
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({
        description: t("CreateError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("CreateUser")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateUser")}</DialogTitle>
          <DialogDescription>{t("CreateDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <Input placeholder={t("EmailPlaceholder")} {...field} />
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
                  <Input placeholder={t("UsernamePlaceholder")} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Password")}</FormLabel>
                  <Input
                    type="password"
                    placeholder={t("PasswordPlaceholder")}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ConfirmPassword")}</FormLabel>
                  <Input
                    type="password"
                    placeholder={t("ConfirmPasswordPlaceholder")}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-user-form"
            disabled={addUserMutation.isPending}
          >
            {addUserMutation.isPending ? (
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
