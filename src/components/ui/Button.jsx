const variants = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",

  
  blue: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",

  outline:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizes = {
  md: "h-10 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}