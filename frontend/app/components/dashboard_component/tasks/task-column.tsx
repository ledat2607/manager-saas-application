import React from 'react'
import TaskCard from './task-card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4",
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center gap-4">
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline" className='rounded-md px-5'>{tasks?.length || 0}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4",
          )}
        >
          {tasks?.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks?.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn