import { useMemo, useState } from "react";

function normalizeInput(v) {
  return String(v || "").replace(/\s+/g, " ").trim();
}

export function useCreateProgramForm() {
  
  const unitSuggestions = useMemo(
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

  const roleSuggestions = useMemo(
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

  
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");

  function buildPayload() {
    const nameClean = normalizeInput(title);
    const unitClean = normalizeInput(unit);
    const roleClean = normalizeInput(role);
    const descClean = normalizeInput(description);
    const responsibleClean = normalizeInput(responsible);

    return {
      name: nameClean, // required i schema

      
      unit: unitClean || undefined,
      targetRole: roleClean || undefined,
      description: descClean || undefined,

      
      responsible: responsibleClean || undefined,
    };
  }

  return {
    // suggestions
    unitSuggestions,
    roleSuggestions,

    // fields
    title,
    unit,
    role,
    description,
    responsible,

    // setters
    setTitle,
    setUnit,
    setRole,
    setDescription,
    setResponsible,

    buildPayload,
  };
}