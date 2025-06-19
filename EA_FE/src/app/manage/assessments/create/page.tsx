"use client";
import { useSearchParams } from "next/navigation";
import FormAssessment from "../../teams/form-assessment";

export default function CreateAssessment() {
  const searchParams = useSearchParams();
  const teamId = Number(searchParams.get("teamId")) || 0;
  const userId = Number(searchParams.get("userId")) || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Assessment</h1>
      <FormAssessment
        teamId={teamId}
        userId={userId}
        onSubmitSuccess={() => {
          // Redirect hoặc refresh sau khi submit thành công (tuỳ ý)
          window.location.href = "/teams"; // Quay lại trang teams sau khi submit
        }}
      />
    </div>
  );
}
