type Dict = Record<string, Record<string, string>>;

export function buildOptions(
  dict: Dict,
  locale: string
): { value: string; label: string }[] {
  const data = dict[locale] || dict["en"];
  return Object.entries(data).map(([value, label]) => ({
    value,
    label,
  }));
}