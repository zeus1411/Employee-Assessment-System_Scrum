import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select"; // Sử dụng trực tiếp từ Radix UI
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Định nghĩa schema cho form với Zod
const assessmentFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDateType: z.enum(["day", "week", "quarter", "year"], {
    required_error: "End date type is required",
  }),
  assessmentType: z.string().min(1, "Assessment type is required"),
  score: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100"),
  feedback: z.string().min(1, "Feedback is required"),
});

interface AssessmentFormData {
  startDate: Date | null;
  endDateType: "day" | "week" | "quarter" | "year";
  score: number;
  feedback: string;
  assessmentType: string;
  criteriaIds: number[];
  teamId: number;
  userId: number;
}

interface AssessmentCriteria {
  id: number;
  criteriaName: string;
  assessmentType?: string;
}

interface ApiResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: AssessmentCriteria[];
}

interface FormAssessmentProps {
  onSubmitSuccess?: () => void;
  teamId: number;
  userId: number;
}

const FormAssessment: React.FC<FormAssessmentProps> = ({
  onSubmitSuccess,
  teamId,
  userId,
}) => {
  const router = useRouter();
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cập nhật currentDate theo thời gian hiện tại (01:08 PM +07 on Thursday, June 19, 2025)
  const currentDate = new Date("2025-06-19T13:08:00+07:00");

  const endDateTypes = ["day", "week", "quarter", "year"] as const;

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      startDate: null,
      endDateType: "day",
      score: 0,
      feedback: "",
      assessmentType: "",
      criteriaIds: [],
      teamId,
      userId,
    },
  });

  // Fetch assessment types
  useEffect(() => {
    const fetchAssessmentTypes = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>(
          "/api/v1/assessment-criteria",
          {
            params: { page: 1, pageSize: 100 },
          }
        );
        console.log("API Response:213123123213", response.data); // Log để debug
        const data = response.data.result || [];
        const uniqueAssessmentTypes = [
          ...new Set(
            data.map((item) => item.assessmentType || "").filter((type) => type)
          ),
        ];
        if (uniqueAssessmentTypes.length === 0) {
          console.warn("No assessment types found in the response");
        }
        setAssessmentTypes(uniqueAssessmentTypes);
      } catch (error) {
        console.error(
          "Error fetching assessment types:",
          error.response?.data || error.message
        );
        toast({
          title: "Error",
          description:
            "Failed to fetch assessment types. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentTypes();
  }, []);

  // Tính end date dựa trên start date và end date type
  const calculateEndDate = (start: Date, type: string): Date => {
    const end = new Date(start);
    switch (type) {
      case "week":
        end.setDate(start.getDate() + 6);
        break;
      case "quarter":
        end.setMonth(start.getMonth() + 2);
        end.setDate(
          new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()
        );
        break;
      case "year":
        end.setFullYear(start.getFullYear() + 1);
        end.setDate(end.getDate() - 1);
        break;
      default: // day
        break;
    }
    return end;
  };

  // Xử lý submit form
  const onSubmit = async (data: AssessmentFormData) => {
    if (data.startDate > currentDate) {
      toast({
        title: "Invalid Date",
        description: "Start date cannot be in the future.",
        variant: "destructive",
      });
      return;
    }

    const endDate = calculateEndDate(data.startDate, data.endDateType);
    if (endDate > currentDate) {
      toast({
        title: "Invalid Date",
        description: "Calculated end date cannot be in the future.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        startDate: data.startDate.toISOString(),
        endDate: endDate.toISOString(),
        endDateType: data.endDateType,
        score: data.score,
        feedback: data.feedback,
        assessmentType: data.assessmentType,
        criteriaIds: data.criteriaIds,
        teamId: data.teamId,
        userId: data.userId,
      };

      await axios.post("http://localhost:8080/api/v1/assessments", payload);
      toast({
        title: "Success",
        description: "Assessment created successfully.",
      });
      onSubmitSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Assessment Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    maxDate={currentDate}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date Type</FormLabel>
                <FormControl>
                  <SelectPrimitive
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full border p-2 rounded-md">
                      <SelectValue placeholder="Select end date type" />
                    </SelectTrigger>
                    <SelectContent>
                      {endDateTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPrimitive>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assessmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Type</FormLabel>
                <FormControl>
                  <SelectPrimitive
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading || assessmentTypes.length === 0}
                  >
                    <SelectTrigger className="w-full border p-2 rounded-md">
                      <SelectValue placeholder="Select an assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Select an assessment type
                      </SelectItem>
                      {assessmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPrimitive>
                </FormControl>
                {loading && (
                  <p className="text-sm text-gray-500">
                    Loading assessment types...
                  </p>
                )}
                {!loading && assessmentTypes.length === 0 && (
                  <p className="text-sm text-red-500">
                    No assessment types available
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score (0-100)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter score"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    value={field.value || ""}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Enter feedback"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            Submit Assessment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormAssessment;
