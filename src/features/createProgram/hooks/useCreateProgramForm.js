import { useMemo, useState } from "react";

export function useCreateProgramForm() {
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

  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");

  function buildPayload() {
    return {
      name: title.trim(),
      unit: unit || undefined,
      targetRole: role || undefined,
      description: description.trim() || undefined,

      // responsible finns inte i schema än, sparas inte i DB just nu
      responsible: responsible.trim() || undefined,
    };
  }

  return {
    // lists
    units,
    roles,

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

    // helper
    buildPayload,
  };
}