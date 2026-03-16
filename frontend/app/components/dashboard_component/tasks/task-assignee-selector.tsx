import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ProjectMemberRole, Task, User } from "@/types";
import { m } from "framer-motion";
import { useUpdateTaskAssignee } from "hook/use-task";
import { Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TaskAssigneeSelector = ({
  task,
  assignees,
  projectMembers,
}: {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
}) => {
  const { mutate, isPending } = useUpdateTaskAssignee();

  const [dropdown, setDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignees.map((assignee) => assignee._id),
  );

  const handleSelectAll = () => {
    const allIds = projectMembers.map((member) => member.user._id);
    //setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
    setSelectedIds(allIds);
  };
  const handleUnSelect = () => {
    setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    let newSelect: string[] = [];
    if (selectedIds.includes(id)) {
      newSelect = selectedIds.filter((nId) => nId !== id);
    } else {
      newSelect = [...selectedIds, id];
    }
    setSelectedIds(newSelect);
  };

  const handleSave = () => {
    console.log(task._id, selectedIds);
    mutate(
      {
        taskId: task._id,
        assignees: selectedIds,
      },
      {
        onSuccess: () => {
          setDropdown(false);
          toast.success(`Update successfull`);
        },
        onError: (error: any) => {
          const errMes = error.response.data.message || "Failed to update";
          toast.error(errMes);
          console.log(error);
        },
      },
    );
  };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Users className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Assignees
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 mt-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-muted-foreground">Unassignee</span>
        ) : (
          projectMembers
            .filter((member) => selectedIds.includes(member.user._id))
            .map((m) => (
              <div
                key={m.user._id}
                className="flex items-center bg-transparent py-1 gap-2"
              >
                <Avatar className="size-6">
                  <AvatarImage
                    src={m.user.profilePicture}
                    title={m.user.name}
                    className="cursor-pointer"
                  />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* <span className="text-xs truncate text-muted-foreground">
                  {m.user.name}
                </span> */}
              </div>
            ))
        )}
      </div>
      {/*Dropdowm */}
      <div className="relative">
        <Button
          className="text-sm text-muted-foreground w-full border rounded px-2 py-1 text-left bg-white"
          onClick={() => setDropdown(!dropdown)}
        >
          {selectedIds.length === 0
            ? "Select assignees"
            : `${selectedIds.length} assigness`}
        </Button>

        {dropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded max-h-60 shadow-lg overflow-y-auto">
            <div className="flex justify-between px-2 py-1 border-b">
              <Button
                className="text-xs"
                variant={"primary"}
                onClick={handleSelectAll}
              >
                Select all
              </Button>
              <Button
                className="text-xs font-semibold text-red-500"
                variant={"outline"}
                onClick={handleUnSelect}
              >
                Delete all
              </Button>
            </div>
            {projectMembers.map((m) => (
              <Label
                key={m.user._id}
                className="flex items-center px-3 py-4 cursor-pointer hover:bg-gray300"
              >
                <Checkbox
                  checked={selectedIds.includes(m.user._id)}
                  onCheckedChange={() => handleSelect(m.user._id)}
                  className="mr-2"
                />{" "}
                <Avatar className="size-6">
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs truncate text-muted-foreground">
                  {m.user.name}
                </span>
              </Label>
            ))}

            <div className="flex justify-between px-2 py-1">
              <Button
                variant={"outline"}
                size={"sm"}
                className="font-light"
                onClickCapture={() => setDropdown(!dropdown)}
              >
                Cancel
              </Button>
              <Button
                variant={"primary"}
                size={"sm"}
                className="font-light"
                onClickCapture={() => handleSave()}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssigneeSelector;
