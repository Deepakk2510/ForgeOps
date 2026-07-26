import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import useCountUp from "@/hooks/useCountUp";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatsCardProps) {
  // Check if the value is a pure number
  const numericValue = Number(value);
  const isNumeric = !isNaN(numericValue);

  // Animate only numeric values
  const count = useCountUp(isNumeric ? numericValue : 0);

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/40">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {isNumeric ? count : value}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}