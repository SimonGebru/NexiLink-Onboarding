export function getUiStatus(progress, overallStatus) {
  if (overallStatus === "paused") return "Pausad";
  if ((progress?.percent || 0) >= 100) return "Klar";
  if ((progress?.done || 0) > 0) return "Pågår";
  return "Ej startad";
}