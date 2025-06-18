import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AssessmentTable from "./assessment-table";

export default async function AssessmentsDashboard() {
  const t = await getTranslations("ManageAssessments");
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("Title")}</CardTitle>
            <CardDescription>{t("Description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <AssessmentTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
