import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TeamTable from "./teams-table";

export default async function TeamsDashboard() {
  const t = await getTranslations("ManageTeams");
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
              <TeamTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
