export type JsonPrimitive = string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export function tString(t: (key: string) => JsonValue, key: string): string {
  const v = t(key)
  return typeof v === "string" ? v : String(v ?? "")
}