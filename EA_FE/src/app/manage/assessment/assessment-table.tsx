"use client";
import { useState, useContext, createContext, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  useDeleteAssessmentMutation,
  useAssessmentList,
} from "@/queries/useAssessment";
import { useAccountProfile } from "@/queries/useAccount";
import { AssessmentCriteriaType } from "@/schemaValidations/assessment.schema";
import TableSkeleton from "@/components/Skeleton";
import EditAssessment from "./edit-assessment-form";
import CreateAssessment from "./create-assessment-form";

const AssessmentTableContext = createContext<{
  assessmentIdEdit: number | undefined;
  setAssessmentIdEdit: (value: number | undefined) => void;
  assessmentDelete: AssessmentCriteriaType | null;
  setAssessmentDelete: (value: AssessmentCriteriaType | null) => void;
}>({
  assessmentIdEdit: undefined,
  setAssessmentIdEdit: () => {},
  assessmentDelete: null,
  setAssessmentDelete: () => {},
});

const PAGE_SIZE = 20;

function AlertDialogDeleteAssessment({
  assessmentDelete,
  setAssessmentDelete,
  onSuccess,
}: {
  assessmentDelete: AssessmentCriteriaType | null;
  setAssessmentDelete: (value: AssessmentCriteriaType | null) => void;
  onSuccess?: () => void;
}) {
  const t = useTranslations("ManageAssessments");
  const { mutateAsync, isPending } = useDeleteAssessmentMutation();

  const deleteAssessment = async () => {
    if (assessmentDelete) {
      try {
        console.log("ladasda sda sd asd asd sasdd asd asd asd ");

        await mutateAsync(assessmentDelete.assessmentCriteriaId);
        console.log("asdasdasdasdsa", assessmentDelete);
        console.log("assessDelete", assessmentDelete.assessmentCriteriaId);
        setAssessmentDelete(null);
        // toast({ description: t("DeleteSuccess") });
        // onSuccess?.();
      } catch (error) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(assessmentDelete)}
      onOpenChange={(value) => {
        if (!value) setAssessmentDelete(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("ConfirmDelete")}{" "}
            <span className="font-bold">{assessmentDelete?.criteriaName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAssessment} disabled={isPending}>
            {isPending ? t("Submitting") : t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AssessmentTable() {
  const t = useTranslations("ManageAssessments");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [assessmentIdEdit, setAssessmentIdEdit] = useState<
    number | undefined
  >();
  const [assessmentDelete, setAssessmentDelete] =
    useState<AssessmentCriteriaType | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const assessmentListQuery = useAssessmentList(page, pageSize);
  const data = assessmentListQuery.data?.payload.data.result ?? [];
  const totalItems = assessmentListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<AssessmentCriteriaType>[] = [
    {
      accessorKey: "assessmentCriteriaId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("ID")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("assessmentCriteriaId")}</div>,
    },
    {
      accessorKey: "criteriaName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("CriteriaName")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("criteriaName")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Description")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      header: t("Actions"),
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                setAssessmentIdEdit(row.original.assessmentCriteriaId)
              }
            >
              {t("Edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssessmentDelete(row.original)}>
              {t("Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, pagination: { pageIndex, pageSize } },
    pageCount: totalPages,
    manualPagination: true,
  });

  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [table, pageIndex]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <AssessmentTableContext.Provider
      value={{
        assessmentIdEdit,
        setAssessmentIdEdit,
        assessmentDelete,
        setAssessmentDelete,
      }}
    >
      <div className="w-full">
        <EditAssessment
          id={assessmentIdEdit}
          setId={setAssessmentIdEdit}
          onSubmitSuccess={() => {
            setAssessmentIdEdit(undefined);
            assessmentListQuery.refetch();
          }}
        />
        <AlertDialogDeleteAssessment
          assessmentDelete={assessmentDelete}
          setAssessmentDelete={setAssessmentDelete}
          onSuccess={assessmentListQuery.refetch}
        />
        {assessmentListQuery.isLoading ? (
          <TableSkeleton />
        ) : assessmentListQuery.isError ? (
          <div className="text-red-500">
            {t("Error")}: {assessmentListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <CreateAssessment onSubmitSuccess={assessmentListQuery.refetch} />
              <Input
                placeholder={t("FilterCriteriaNames")}
                value={
                  (table
                    .getColumn("criteriaName")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("criteriaName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                placeholder={t("FilterDescriptions")}
                value={
                  (table
                    .getColumn("description")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("description")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {t("NoResults")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="text-xs text-muted-foreground">
                {paginationT("Pagi1")}{" "}
                <strong>{table.getRowModel().rows.length}</strong>{" "}
                {paginationT("Pagi2")} <strong>{totalItems}</strong>{" "}
                {paginationT("Pagi3")}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  {paginationT("Previous")}
                </Button>
                <span>
                  {paginationT("Page")} {page} {paginationT("Of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  {paginationT("Next")}
                </Button>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    goToPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={paginationT("RowsPerPage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </div>
    </AssessmentTableContext.Provider>
  );
}
