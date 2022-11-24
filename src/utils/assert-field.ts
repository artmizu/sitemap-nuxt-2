export function assertField<T extends { [field in Field]?: T[field] }, Field extends keyof T & string>(
  obj: T,
  field: Field,
): obj is T & { [field in Field]: NonNullable<T[field]> } {
  return !!obj[field]
}
