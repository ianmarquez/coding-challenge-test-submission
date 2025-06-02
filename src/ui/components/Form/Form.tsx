import React, { FunctionComponent } from "react";

import Button from "../Button/Button";
import InputText, { InputTextProps } from "../InputText/InputText";
import $ from "./Form.module.css";

interface FormEntry {
  name: string;
  placeholder: string;
  extraProps: Omit<InputTextProps, "name" | "placeholder" | "disabled">;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: Awaited<(e: React.ChangeEvent<HTMLFormElement>) => void>;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}-container`} className={$.formRow}>
            <InputText
              name={name}
              placeholder={placeholder}
              disabled={loading}
              {...extraProps}
            />
          </div>
        ))}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
