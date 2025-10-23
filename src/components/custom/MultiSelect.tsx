import { useTheme } from "next-themes";
import { Controller } from "react-hook-form";
import { FormItem, FormLabel, FormMessage } from "@/componentsUI/form";
import Select from "react-select";

export function MultiSelect({ ...props }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <FormLabel>{props.title}</FormLabel>
          <Select
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
            options={props.data}
            value={props.data.filter(({ value }: { value: string }) =>
              field.value?.includes(value)
            )}
            onChange={(options) =>
              field.onChange(options.map((opt) => opt.value))
            }
            placeholder={props.placeholder}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: isDark ? "#1a1c23" : "#fff",
                color: isDark ? "#fff" : "#000",
                borderColor: state.isFocused
                  ? "#1d4ed8"
                  : isDark
                  ? "#374151"
                  : "#e5e7eb", // gray-200
                minHeight: 40,
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#1d4ed8",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: isDark ? "#232634" : "#fff",
                color: isDark ? "#fff" : "#000",
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? isDark
                    ? "#282c34"
                    : "#f3f4f6"
                  : state.isFocused
                  ? isDark
                    ? "#374151"
                    : "#f3f4f6"
                  : isDark
                  ? "#232634"
                  : "#fff",
                color: isDark ? "#fff" : "#000",
                "&:active": {
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#fff" : "#000",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: isDark ? "#fff" : "#000",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: isDark ? "#fff" : "#000",
                ":hover": {
                  backgroundColor: "#ef4444",
                  color: "#fff",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: isDark ? "#fff" : "#000",
              }),
              placeholder: (base) => ({
                ...base,
                color: isDark ? "#6b7280" : "#9ca3af",
              }),
              input: (base) => ({
                ...base,
                color: isDark ? "#fff" : "#000",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: isDark ? "#9ca3af" : "#6b7280",
                "&:hover": { color: isDark ? "#fff" : "#000" },
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: isDark ? "#374151" : "#e5e7eb",
              }),
              clearIndicator: (base) => ({
                ...base,
                color: isDark ? "#9ca3af" : "#6b7280",
                "&:hover": { color: isDark ? "#fff" : "#ef4444" },
              }),
            }}
          />

          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
