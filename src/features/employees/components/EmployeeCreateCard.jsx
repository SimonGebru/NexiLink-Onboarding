import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { FormField, Input } from "../../../components/ui/Form";

export default function EmployeeCreateCard({
  fullName,
  setFullName,
  jobTitle,
  setJobTitle,
  email,
  setEmail,
  creating,
  onCreate,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skapa anställd</CardTitle>
        <CardDescription>
          Motsvarar POST /api/employees (tidigare Postman).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Fullständigt namn (fullName)">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormField>

          <FormField label="Titel (jobTitle)">
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </FormField>

          <FormField label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onCreate}
            disabled={creating}
            className="h-10 px-4 bg-[#1A4D4F] hover:bg-[#1A4D4F]/90"
          >
            {creating ? "Skapar..." : "Skapa"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}