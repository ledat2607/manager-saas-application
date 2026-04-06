import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, Workspace } from "@/types";
import { Loader, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetWorkspaceDetailsQuery } from "hook/use-worksapce";
import ListViewuser from "@/components/dashboard_component/dashboard/list-view-user";
import BoardViewUser from "@/components/dashboard_component/dashboard/board-view-user";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState<string>(initialSearch);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const filteredMembers = data?.members?.filter(
    (member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h3 className="text-xl font-bold">My Teams</h3>
      </div>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />

        <Input
          placeholder="Search member name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="board">Board view</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ListViewuser filterMembers={filteredMembers || []} />
        </TabsContent>
        <TabsContent value="board" className="mt-6">
          <BoardViewUser filterMembers={filteredMembers || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
