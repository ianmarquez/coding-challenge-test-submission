import { ChangeEvent, useCallback, useState } from "react";

type InputChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export function useDynamicForm<T extends Record<string, any>>(
  initialValues = {} as T,
) {
  const [formValues, setFormValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: InputChangeEvent) => {
    const { name, type, value } = e.target;

    const newValue =
      e.target instanceof HTMLInputElement && type === "radio"
        ? e.target.value
        : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }, []);

  const clearAll = (exclude?: Array<keyof T>) => {
    setFormValues((prevValues) => {
      const newValues = { ...initialValues };

      if (!exclude || exclude.length === 0) {
        return newValues;
      }

      exclude.forEach((key) => {
        newValues[key] = prevValues[key];
      });
      return newValues;
    });
  };

  return {
    values: formValues,
    onChange: handleChange,
    clearAll,
  };
}
