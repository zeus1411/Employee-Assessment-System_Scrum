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
import { Loader2 } from "lucide-react";
import {
  CreateAssessmentBodyType,
  CreateAssessmentBody,
} from "@/schemaValidations/assessment.schema";
import { useAddAssessmentMutation } from "@/queries/useAssessment";

type CreateAssessmentProps = {
  onSubmitSuccess?: () => void;
};

export default function CreateAssessment({
  onSubmitSuccess,
}: CreateAssessmentProps) {
  const t = useTranslations("ManageAssessments");
  const [open, setOpen] = useState(false);
  const addAssessmentMutation = useAddAssessmentMutation();

  const form = useForm<CreateAssessmentBodyType>({
    resolver: zodResolver(CreateAssessmentBody),
    defaultValues: {
      criteriaName: "",
      description: "",
    },
  });

  const reset = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (values: CreateAssessmentBodyType) => {
    if (addAssessmentMutation.isPending) return;
    try {
      await addAssessmentMutation.mutateAsync(values);
      toast({
        description: t("CreateSuccess", { criteriaName: values.criteriaName }),
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
        <Button>{t("CreateAssessment")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateAssessment")}</DialogTitle>
          <DialogDescription>{t("CreateDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-assessment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="criteriaName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("CriteriaName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("CriteriaNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("DescriptionPlaceholder")}
                      {...field}
                    />
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
            form="create-assessment-form"
            disabled={addAssessmentMutation.isPending}
          >
            {addAssessmentMutation.isPending ? (
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
