import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingSpinner = () => {
  return (
    <img
      className={$.spinner}
      width="20"
      height="20"
      src="/spinner.svg"
      data-testid="loading-spinner"
    />
  );
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  return (
    <button
      className={`${$.button} ${$[variant]}`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && (
        <>
          <LoadingSpinner />
          &nbsp;
        </>
      )}
      {children}
    </button>
  );
};

export default Button;
