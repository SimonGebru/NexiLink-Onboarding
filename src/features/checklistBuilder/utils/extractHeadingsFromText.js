
export function extractHeadingsFromText(text) {
  if (!text) return "";

  const lines = String(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Plocka rader som ser rubrikiga ut
  const headings = [];
  for (const line of lines) {
    const isTooLong = line.length > 80;
    const hasPeriod = line.includes(".");
    const hasManyCommas = (line.match(/,/g) || []).length >= 2;

    // Kommentar: “rubriker” är ofta kortare, utan punkt, utan många kommatecken
    if (isTooLong) continue;
    if (hasPeriod) continue;
    if (hasManyCommas) continue;

    // Kommentar: hoppa över rader utan bokstäver (bara siffror/symboler)
    if (!/[A-Za-zÅÄÖåäö]/.test(line)) continue;

    headings.push(line);
  }

  // Kommentar: ta bort duplicerade rubriker (case-insensitive)
  const seen = new Set();
  const unique = [];
  for (const h of headings) {
    const key = h.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
  }

  // Om vi får för få rubriker, fall back till tom string
  return unique.length >= 2 ? unique.join("\n") : "";
}