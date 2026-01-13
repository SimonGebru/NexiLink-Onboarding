export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={["p-5", className].join(" ")}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={["text-lg font-semibold text-slate-900", className].join(" ")}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={["text-sm text-slate-500", className].join(" ")}>{children}</p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={["px-5 pb-5", className].join(" ")}>{children}</div>;
}