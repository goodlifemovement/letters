import clsx from "clsx";
import React, { forwardRef, ForwardedRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef(function Input(
  { className, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      className={clsx("p-6 rounded-full", className)}
      ref={ref}
      {...props}
    />
  );
});

export default Input;
