import { Link } from "react-router-dom";
import { useMemo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FormField, Input, Select, Textarea } from "../components/ui/Form";

export default function CreateProgram() {
  const units = useMemo(
    () => [
      "Individ- och familjeomsorg",
      "Barn och unga",
      "Missbruk och beroende",
      "Äldreomsorg",
      "Funktionsstöd",
      "Arbetsmarknad och integration",
      "Socialpsykiatri",
    ],
    []
  );

  const roles = useMemo(
    () => [
      "Socionom",
      "Socialsekreterare",
      "Kurator",
      "Behandlare",
      "Biståndshandläggare",
      "Familjebehandlare",
      "Enhetschef",
    ],
    []
  );

  return (
    <div className="w-full space-y-10">
      {/* Page header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-700 sm:text-4xl">
          Skapa nytt onboardingprogram
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-500 sm:text-mg">
          Program kan återanvändas för flera nyanställda.
        </p>
      </div>

      {/* Form card */}
      <Card variant="form" className="w-full">
        <CardHeader variant="form">
          <CardTitle className="text-xl sm:text-2xl">
            Programdetaljer
          </CardTitle>
          <CardDescription className="text-base">
            Fyll i informationen nedan för att skapa ett nytt onboardingprogram.
          </CardDescription>
        </CardHeader>

        <CardContent variant="form" className="space-y-10">
          {/* Program name */}
          <FormField label="Programnamn">
            <Input
              className="h-12 text-base"
              placeholder="T.ex. Ny anställd i marknadsavdelningen"
            />
          </FormField>

          {/* Unit + Role */}
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Enhet">
              <Select className="h-12 text-base" defaultValue="">
                <option value="" disabled>
                  Välj en enhet
                </option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Roll">
              <Select className="h-12 text-base" defaultValue="">
                <option value="" disabled>
                  Välj en roll
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Beskrivning (valfri)">
            <Textarea
              className="text-base min-h-[200px]"
              rows={6}
              placeholder="Ange en kort beskrivning av programmet, t.ex. mål, syfte eller specifika instruktioner för nyanställda."
            />
          </FormField>

          {/* Owner */}
          <FormField label="Ansvarig (valfri)">
            <Input
              className="h-12 text-base"
              placeholder="Namn på ansvarig person eller avdelning"
            />
          </FormField>

          {/* Divider */}
          <div className="pt-2 border-t border-slate-100" />

          {/* Next step */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-base font-semibold text-slate-900">
                Ladda upp material
              </div>
              <p className="text-sm sm:text-base text-slate-500">
                Nästa steg: ladda upp filer och länkar till programmet.
              </p>
            </div>

            <Link to="/programs/demo/material" className="w-full sm:w-auto">
              <Button className="h-12 w-full sm:w-auto px-6 text-base">
                Gå vidare
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      
      <div className="h-1" />
    </div>
  );
}
