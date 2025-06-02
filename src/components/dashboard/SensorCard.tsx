
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value?: number;
  unit: string;
  icon: LucideIcon;
  color: "soy-green" | "soy-yellow";
  description: string;
  trend?: number;
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color, 
  description, 
  trend = 0 
}: SensorCardProps) {
  const colorClasses = {
    "soy-green": {
      bg: "bg-soy-green-50",
      border: "border-soy-green-200",
      text: "text-soy-green-800",
      icon: "text-soy-green-600",
      badge: "bg-soy-green-100 text-soy-green-800"
    },
    "soy-yellow": {
      bg: "bg-soy-yellow-50",
      border: "border-soy-yellow-200", 
      text: "text-soy-yellow-800",
      icon: "text-soy-yellow-600",
      badge: "bg-soy-yellow-100 text-soy-yellow-800"
    }
  };

  const classes = colorClasses[color];
  const isPositiveTrend = trend > 0;
  const hasSignificantTrend = Math.abs(trend) > 0.1;

  return (
    <Card className={`${classes.bg} ${classes.border} border-2 hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-opacity-80`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${classes.icon}`} />
            <CardTitle className={`text-sm font-medium ${classes.text}`}>
              {title}
            </CardTitle>
          </div>
          {hasSignificantTrend && (
            <div className="flex items-center gap-1">
              {isPositiveTrend ? (
                <ArrowUp className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${classes.text}`}>
              {value ? value.toFixed(1) : "--"}
            </span>
            <span className={`text-sm ${classes.text} opacity-70`}>
              {unit}
            </span>
          </div>
          <Badge variant="outline" className={`${classes.badge} text-xs`}>
            {description}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
