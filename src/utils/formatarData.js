// "2026-09-28" -> "28/09/2026"
export function formatarData(iso) {
  if (!iso) return ""
  const [ano, mes, dia] = iso.split("-")
  return `${dia}/${mes}/${ano}`
}
