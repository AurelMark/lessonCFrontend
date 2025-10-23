import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  Globe,
  LogIn,
  User,
  Network,
  Link2,
  Cpu,
  Smartphone,
} from "lucide-react";
import { HistoryLogsArray } from "@/validation/history";
import { cn } from "@/lib/utils";

type THistoryLogsListProps = {
  data: HistoryLogsArray;
};

export default function AdminHistoryLogs({ data }: THistoryLogsListProps) {
  if (!data?.length)
    return (
      <div className="text-muted-foreground py-12 text-center">
        No logs found.
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((log, idx) => (
        <Card key={idx} className="rounded-2xl shadow p-0">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-primary" size={18} />
              <span className="font-medium">{log.method}</span>
              <Badge
                variant="outline"
                className={cn(
                  log.status
                    ? "border-green-600 text-green-600"
                    : "border-red-600 text-red-600"
                )}
              >
                {log.status || "N/A"}
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 size={16} />
              <span className="truncate">{log.url}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe size={16} />
              <span className="truncate">{log.ip}</span>
              {log.deviceType && (
                <>
                  <Cpu size={15} className="ml-2" />{" "}
                  <span>{log.deviceType}</span>
                </>
              )}
              {log.os && (
                <>
                  <Smartphone size={15} className="ml-2" />{" "}
                  <span>{log.os}</span>
                </>
              )}
              {log.browser && (
                <>
                  <Network size={15} className="ml-2" />{" "}
                  <span>{log.browser}</span>
                </>
              )}
            </div>
            {log.login && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <User size={15} /> <span>{log.login}</span>
              </div>
            )}
            {log.userAgent && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>User-Agent:</span>
                <span className="truncate">{log.userAgent}</span>
              </div>
            )}
            {log.attemptedLogin && (
              <div className="border rounded bg-destructive/10 px-3 py-2 text-xs mt-2 flex flex-col gap-1 text-destructive">
                <div className="flex items-center gap-2 font-semibold">
                  <LogIn size={15} /> Failed login attempt
                </div>
                <div>
                  <span className="font-medium">Login:</span>{" "}
                  {log.attemptedLogin.login}
                </div>
                <div>
                  <span className="font-medium">Password:</span>{" "}
                  <span className="blur-sm select-none">
                    {log.attemptedLogin.password}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
