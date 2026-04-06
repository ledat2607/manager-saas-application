import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Task } from "@/types";
import { format } from "date-fns";
import { Link } from "react-router";

const CalendarView = ({ sortTask }: { sortTask: Task[] }) => {
  const events = sortTask.map((task) => ({
    id: task._id,
    title: task.title,
    start: task.startDate, // "2026-04-23..."
    end: task.dueDate, // "2026-04-29..."

    backgroundColor: task.priority === "High" ? "#fee2e2" : "#f1f5f9",
    borderColor: task.priority === "High" ? "#ef4444" : "#cbd5e1",
    textColor: task.priority === "High" ? "#991b1b" : "#334155",
    extendedProps: { ...task },
  }));

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        // Custom giao diện cho từng ô Task trên lịch
        eventContent={(eventInfo) => (
          <div className="p-1 overflow-hidden transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-1">
              {/* Chấm tròn hiển thị độ ưu tiên */}
              <span
                className={`w-2 h-2 rounded-full ${
                  eventInfo.event.extendedProps.priority === "High"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
              <Link
                to={`/workspaces/${eventInfo.event.extendedProps.project.workspace}/projects/${eventInfo.event.extendedProps.project}/tasks/${eventInfo.event.extendedProps._id}`}
              >
                <b className="truncate text-xs">{eventInfo.event.title}</b>
              </Link>
            </div>
          </div>
        )}
        height="auto"
      />

      {/* Ghi chú thêm CSS để fix màu sắc cho Dark Mode của Calendar */}
      <style>{`
        .fc {
          --fc-border-color: #334155;
          --fc-page-bg-color: transparent;
        }
        .fc-toolbar-title {
          font-size: 1.2rem !important;
          font-weight: bold;
        }
        .fc-daygrid-day:hover {
          background-color: #1e293b !important;
        }
        .fc-event {
          border-radius: 4px !important;
          border: 1px solid !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
