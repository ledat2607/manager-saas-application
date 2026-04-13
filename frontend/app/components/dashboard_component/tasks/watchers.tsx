import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types";

const Watchers = ({ watchers }: { watchers: User[] }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Watchers</h3>

      <div className="space-y-2">
        {watchers && watchers.length > 0 ? (
          watchers.map((watcher) => (
            <div key={watcher._id} className="flex items-center gap-4">
              <Avatar title={watcher.name}>
                <AvatarImage src={watcher.profilePicture} alt="" />
                <AvatarFallback>{watcher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground font-semibold">
                {watcher.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground font-medium">No watchers</p>
        )}
      </div>
    </div>
  );
};

export default Watchers;
