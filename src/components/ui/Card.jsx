function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Card
 * - default → dashboard-kort (kompakt)
 * - form → stora formulär 
 */
export function Card({ children, className = "", variant = "default" }) {
  const variants = {
    default: "rounded-xl border border-slate-200 bg-white shadow-sm",
    form: "rounded-2xl border border-slate-200 bg-white shadow-sm",
  };

  return (
    <div className={cx(variants[variant], className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  variant = "default",
}) {
  const paddings = {
    default: "p-5",
    form: "p-8",
  };

  return (
    <div className={cx(paddings[variant], className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={cx(
        "font-semibold text-slate-900",
        "text-lg",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p
      className={cx(
        "text-slate-500",
        "text-sm",
        className
      )}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  variant = "default",
}) {
  const paddings = {
    default: "px-5 pb-5",
    form: "px-8 pb-8",
  };

  return (
    <div className={cx(paddings[variant], className)}>
      {children}
    </div>
  );
}