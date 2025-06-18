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
  UpdateAssessmentBodyType,
  UpdateAssessmentBody,
} from "@/schemaValidations/assessment.schema";
import {
  useGetAssessment,
  useUpdateAssessmentMutation,
} from "@/queries/useAssessment";
import { da } from "date-fns/locale";

type EditAssessmentProps = {
  id: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditAssessment({
  id,
  setId,
  onSubmitSuccess,
}: EditAssessmentProps) {
  const t = useTranslations("ManageAssessments");
  const { data, isLoading } = useGetAssessment({ id: id || 0, enabled: !!id });
  const updateAssessmentMutation = useUpdateAssessmentMutation();

  const form = useForm<UpdateAssessmentBodyType>({
    resolver: zodResolver(UpdateAssessmentBody),
    defaultValues: {
      criteriaName: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      const { criteriaName, description } = data.payload.data;
      form.reset({ criteriaName, description });
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  const onSubmit = async (values: UpdateAssessmentBodyType) => {
    if (updateAssessmentMutation.isPending || !id) return;
    try {
      await updateAssessmentMutation.mutateAsync({ id, body: values });
      toast({
        description: t("UpdateSuccess", { criteriaName: values.criteriaName }),
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      toast({ description: t("UpdateError"), variant: "destructive" });
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) reset();
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={reset}
      >
        <DialogHeader>
          <DialogTitle>{t("UpdateAssessment")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t("Loading")}</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              id="edit-assessment-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form errors:", errors);
              })}
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
        )}
        <DialogFooter>
          <Button
            type="submit"
            form="edit-assessment-form"
            disabled={updateAssessmentMutation.isPending || isLoading}
          >
            {updateAssessmentMutation.isPending ? (
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
