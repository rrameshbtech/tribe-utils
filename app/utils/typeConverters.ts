export function convertToMutable(input: any) {
  if (!Array.isArray(input)) return []
  return input.map((s: any) => s)
}