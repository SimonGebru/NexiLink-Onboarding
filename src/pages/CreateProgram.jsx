import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

export default function CreateProgram() {
  const navigate = useNavigate();

  // Dummy-data (sen byter vi till Mongo/API)
  const units = useMemo(
  () => [
    "Individ- och familjeomsorg",
    "Barn och unga",
    "Missbruk och beroende",
    "Äldreomsorg",
    "Funktionsstöd",
    "Arbetsmarknad och integration",
    "Socialpsykiatri"
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
    "Enhetschef"
  ],
  []
);

  // Form state (bara UI än så länge)
  const [form, setForm] = useState({
    name: "",
    unit: "",
    role: "",
    description: "",
    owner: "",
  });

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Inget spar än, vi bara visar flödet.
    // Sen: POST /programs -> och navigate till /programs/:id/material
    console.log("Create program draft:", form);

    // Tillfälligt: hoppa tillbaka till översikten efter "skapa"
    navigate("/");
  }