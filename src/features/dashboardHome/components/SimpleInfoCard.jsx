import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/Card";

export default function SimpleInfoCard({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {children}
      </CardContent>
    </Card>
  );
}