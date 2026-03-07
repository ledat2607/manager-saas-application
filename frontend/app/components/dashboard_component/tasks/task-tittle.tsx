import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save } from "lucide-react";
import React, { useState } from "react";

interface TaskTitleProps {
  title: string;
  taskId: string;
}

const TaskTitle = ({ taskId, title }: TaskTitleProps) => {
  const [isEditing, setIsEditng] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };
  return (
    <div className="flex items-center gap-2 mt-4">
      {isEditing ? (
        <Input
          className="text-xl font-semibold w-full min-w-3xl"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      ) : (
        <h2 className="text-xl font-semibold flex-1">{title}</h2>
      )}
      <Button variant={"outline"} onClick={() => setIsEditng(!isEditing)}>
        {isEditing ? (
          <Save className="size-3" />
        ) : (
          <Edit className="size-3 cursor-pointer" />
        )}
      </Button>
    </div>
  );
};

export default TaskTitle;
