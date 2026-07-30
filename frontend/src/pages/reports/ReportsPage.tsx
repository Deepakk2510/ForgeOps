import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const reports = [
    { title: "Weekly Security Scan", date: "Oct 24, 2023", status: "Clean" },
    { title: "Monthly Usage Report", date: "Oct 1, 2023", status: "Generated" },
    { title: "Q3 Code Quality Audit", date: "Sep 30, 2023", status: "Action Required" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and download automated system reports.
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {report.title}
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{report.date}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === "Clean" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  report.status === "Action Required" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {report.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
