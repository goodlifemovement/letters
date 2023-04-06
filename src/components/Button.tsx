import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "py-6 px-10 text-center rounded-full uppercase bg-[#8621dc] text-white font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
