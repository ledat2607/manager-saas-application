import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Bell, Inbox } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: any;
}

const NotificationCard = ({
  isOpen,
  setIsOpen,
  data = [],
}: NotificationCardProps) => {
  console.log(data);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-slate-100 rounded-full transition-all active:scale-95"
        >
          <Bell className="size-5 text-slate-600" />
          {data?.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-95 p-0 gap-0 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-y-scroll max-h-120">
        <DialogHeader className="p-6 pb-4 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Notifications
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                {data?.length}
              </span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-slate-500 mt-1">
            Stay updated with your workspace activities.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-112.5 overflow-y-auto custom-scrollbar p-2">
          {data?.length > 0 ? (
            <div className="flex flex-col gap-1">
              {data.map((notification: any) => (
                <div
                  key={notification._id}
                  className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <Avatar className="size-10 border-2 border-white shadow-sm shrink-0">
                    <AvatarImage
                      src={notification.user?.profilePicture}
                      alt={notification.user?.name}
                    />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                      {notification.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="text-sm text-slate-700 leading-snug">
                      <span className="font-bold text-slate-900 mr-1">
                        {notification.user?.name}
                      </span>
                      <span className="text-slate-600">
                        {notification.details.details}
                      </span>
                    </div>
                    <time className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>

                  {/* Dot xanh biểu thị chưa đọc (tùy chỉnh logic của cậu ở đây) */}
                  <div className="size-1.5 rounded-full bg-blue-500 mt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="size-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Inbox className="size-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                All caught up!
              </p>
              <p className="text-xs text-slate-500">
                No new notifications at the moment.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCard;
