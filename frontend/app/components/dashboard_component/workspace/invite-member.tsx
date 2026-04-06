import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inviteMemberSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInviteMemberToWorkspace } from "hook/use-worksapce";
import { Check, Copy, Loader, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
  workspaceId: string;
}
const ROLES = ["owner", "member", "manager", "viewer"] as const;

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const [inviteTab, setInviteTab] = useState<"email" | "link">("email");
  const [linkCopied, setLinkCopied] = useState(false);
  const { mutate, isPending } = useInviteMemberToWorkspace();

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  const onSubmit = (data: InviteMemberFormData) => {
    if (!workspaceId) return;
    mutate(
      { ...data, workspaceId },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange();
          toast.success("Invitation sent successfully!");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "Failed to send invitation.";
          toast.error(errorMessage);
        },
      },
    );
  };
  const copyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/workspace-invite/${workspaceId}`,
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold!">Invite Members</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="email"
          value={inviteTab}
          onValueChange={() =>
            setInviteTab(inviteTab === "email" ? "link" : "email")
          }
        >
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Share link</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* SECTION: EMAIL INPUT */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Invite member by email
                      </FormLabel>
                      <div className="flex w-full items-center space-x-2 mt-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-11 border-muted focus-visible:ring-primary/30 transition-all"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          size="icon"
                          className="h-11 w-11 shrink-0 shadow-sm hover:shadow-primary/20 transition-all"
                          disabled={form.formState.isSubmitting}
                        >
                          {isPending ? (
                            <Loader className="animate-spin size-4" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage className="text-[12px]" />
                    </FormItem>
                  )}
                />

                {/* SECTION: ROLE SELECTION */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Select role
                        </FormLabel>
                        <p className="text-[13px] text-muted-foreground">
                          Define the level of access for the new member. Owners
                          have full control, while members have limited
                          permissions.
                        </p>
                      </div>

                      <FormControl>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {ROLES.map((role) => {
                            const isActive = field.value === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => field.onChange(role)}
                                className={`
                        relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-sm font-medium transition-all
                        ${
                          isActive
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-muted bg-transparent text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/10"
                        }
                      `}
                              >
                                {/* Có thể thêm Icon tương ứng cho từng Role ở đây */}
                                <span className="capitalize">{role}</span>
                                {isActive && (
                                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                    <Check className="h-3 w-3" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="link">
            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label>Share this link to invite people</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                  />
                  <Button variant="outline" size="sm" onClick={copyInviteLink}>
                    {linkCopied ? (
                      <>
                        <Check className="mr-2 size-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 size-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <i className="text-xs text-muted-foreground font-semibold">
                  Anyone with this link can join the workspace.
                </i>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
