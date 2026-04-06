import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Task } from "@/types";

import { useGetMyTaskQuery, useTaskUpdateStatus } from "hook/use-task";
import { FilterIcon, Loader, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import ListViewTask from "@/components/dashboard_component/dashboard/list-vew-tasks";
import BoardView from "@/components/dashboard_component/dashboard/board-view";
import CalendarView from "@/components/dashboard_component/dashboard/calendar-view";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //custom search params
  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc",
  );
  const [search, setSearch] = useState<string>(initialSearch);
  const { mutate, isPending } = useTaskUpdateStatus();

  const { data: task, isLoading } = useGetMyTaskQuery() as {
    data: Task[];
    isLoading: boolean;
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    params.filter = filter;
    params.sort = sort;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sort, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sort) setSort(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const filterdData =
    task?.length > 0
      ? task
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "inprogress") return task.status === "In Progress";
            if (filter === "done") return task.status === "Done";
            if (filter === "archieved") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";
            if (filter === "medium") return task.priority === "Medium";
            if (filter === "low") return task.priority === "Low";
            return true;
          })
          .filter(
            (t) =>
              t.title.toLowerCase().includes(search.toLowerCase()) ||
              t.description?.toLowerCase().includes(search.toLowerCase()),
          )
      : [];

  //sort task
  const sortTask = [...filterdData].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sort === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center -max-h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h3 className="text-xl font-bold">My Tasks</h3>
        <div
          className="flex flex-col items-start md:flex-row md:gap-2"
          itemScope
        >
          <Button
            variant={"outline"}
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          >
            {sort === "asc" ? "Oldest First" : "Newest First"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <FilterIcon className="size-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filters Task</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("archieved")}>
                Archieved
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Task Priority</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setFilter("high")}
                        className="text-red-500 font-bold"
                      >
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilter("medium")}
                        className="text-blue-500 font-bold"
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilter("low")}
                        className="text-emerald-500 font-bold"
                      >
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Task Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="flex flex-col gap-2">
                      <DropdownMenuItem
                        onClick={() => setFilter("inprogress")}
                        className="bg-yellow-500 text-white font-bold cursor-pointer hover:bg-yellow-700!"
                      >
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilter("todo")}
                        className="bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-700!"
                      >
                        To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilter("done")}
                        className="bg-green-500 text-white font-bold cursor-pointer hover:bg-green-700!"
                      >
                        Done
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />

        <Input
          placeholder="Search task title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="board">Board view</TabsTrigger>
          <TabsTrigger value="calendar">Calendar view</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ListViewTask sortTask={sortTask} />
        </TabsContent>
        <TabsContent value="board" className="mt-6">
          <BoardView sortTask={sortTask} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <CalendarView sortTask={sortTask} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
