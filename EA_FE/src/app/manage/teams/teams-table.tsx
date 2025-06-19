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
import { useDeleteTeamMutation, useTeamList } from "@/queries/useTeam";
import TableSkeleton from "@/components/Skeleton";
import EditTeam from "./edit-team-form";
import CreateTeam from "./create-team-form";
import { TeamType } from "@/schemaValidations/team.schema";

const TeamTableContext = createContext<{
  teamIdEdit: number | undefined;
  setTeamIdEdit: (value: number | undefined) => void;
  teamDelete: TeamType | null;
  setTeamDelete: (value: TeamType | null) => void;
}>({
  teamIdEdit: undefined,
  setTeamIdEdit: () => {},
  teamDelete: null,
  setTeamDelete: () => {},
});

const PAGE_SIZE = 20;

function AlertDialogDeleteTeam({
  teamDelete,
  setTeamDelete,
  onSuccess,
}: {
  teamDelete: TeamType | null;
  setTeamDelete: (value: TeamType | null) => void;
  onSuccess?: () => void;
}) {
  const t = useTranslations("ManageTeams");
  const { mutateAsync, isPending } = useDeleteTeamMutation();

  const deleteTeam = async () => {
    if (teamDelete) {
      try {
        await mutateAsync(teamDelete.teamId);
        setTeamDelete(null);
        toast({ description: t("DeleteSuccess") });
        onSuccess?.();
      } catch (error) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(teamDelete)}
      onOpenChange={(value) => {
        if (!value) setTeamDelete(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("ConfirmDelete")}{" "}
            <span className="font-bold">{teamDelete?.teamName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTeam} disabled={isPending}>
            {isPending ? t("Submitting") : t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TeamTable() {
  const t = useTranslations("ManageTeams");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [teamIdEdit, setTeamIdEdit] = useState<number | undefined>();
  const [teamDelete, setTeamDelete] = useState<TeamType | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const teamListQuery = useTeamList(page, pageSize);
  console.log("asdasdasdasd afsf asf asf ", teamListQuery.data);
  const data = teamListQuery.data?.payload.data.result ?? [];
  const totalItems = teamListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<TeamType>[] = [
    {
      accessorKey: "teamId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("ID")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("teamId")}</div>,
    },
    {
      accessorKey: "teamName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TeamName")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("teamName")}</div>,
    },
    {
      accessorKey: "supervisorId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("SupervisorID")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("supervisorId")}</div>,
    },
    {
      accessorKey: "memberIds",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Members")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      // cell: ({ row }) => (
      //   <div>{(row.getValue("memberIds") as number[]).join(", ")}</div>
      // ),
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
              onClick={() => setTeamIdEdit(row.original.teamId)}
            >
              {t("Edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTeamDelete(row.original)}>
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
    <TeamTableContext.Provider
      value={{ teamIdEdit, setTeamIdEdit, teamDelete, setTeamDelete }}
    >
      <div className="w-full">
        <EditTeam
          id={teamIdEdit}
          setId={setTeamIdEdit}
          onSubmitSuccess={teamListQuery.refetch}
        />
        <AlertDialogDeleteTeam
          teamDelete={teamDelete}
          setTeamDelete={setTeamDelete}
          onSuccess={teamListQuery.refetch}
        />
        {teamListQuery.isLoading ? (
          <TableSkeleton />
        ) : teamListQuery.isError ? (
          <div className="text-red-500">
            {t("Error")}: {teamListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <CreateTeam onSubmitSuccess={teamListQuery.refetch} />
              <Input
                placeholder={t("FilterTeamNames")}
                value={
                  (table.getColumn("teamName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("teamName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                placeholder={t("FilterSupervisorIDs")}
                value={
                  (table
                    .getColumn("supervisorId")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("supervisorId")
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
    </TeamTableContext.Provider>
  );
}
