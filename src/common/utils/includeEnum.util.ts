export function isStringKeyInEnum(value: string, enumObject: any): boolean {
  return Object.keys(enumObject).includes(value);
}
