

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Wrapper runt en hel form/sektion.
 * - Samma spacing och maxbredd används överallt.
 */
export function Form({ className = "", children, ...props }) {
  return (
    <div className={cx("w-full", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Rubrik + beskrivning för form-sidor 
 */
export function FormHeader({ title, description, align = "center" }) {
  return (
    <div
      className={cx(
        "space-y-2",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
      {description ? (
        <p className="text-sm sm:text-base text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

/**
 * En “sektion” inuti kortet: titel + hjälptext.
 */
export function FormSection({ title, description, className = "", children }) {
  return (
    <section className={cx("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title ? (
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Rad för inputs. 
 * - Mobil: 1 kolumn
 * - Desktop: 2 kolumner när man vill
 */
export function FormRow({ cols = 2, className = "", children }) {
  // cols=2 är vanligast. På mobil blir det alltid 1 kolumn.
  const gridCols =
    cols === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";

  return (
    <div className={cx("grid grid-cols-1 gap-4", gridCols, className)}>
      {children}
    </div>
  );
}

/**
 * Ett fält: Label + kontroll + (optional) helperText.
 */
export function FormField({
  label,
  optional = false,
  helperText,
  className = "",
  children,
}) {
  return (
    <div className={cx("space-y-2", className)}>
      {label ? (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-800">
            {label}
          </label>
          {optional ? (
            <span className="text-xs text-slate-400">(valfri)</span>
          ) : null}
        </div>
      ) : null}

      {children}

      {helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

/**
 * Standard-styling för inputs/selects/textareas (så allt ser lika ut).
 */

const baseControl =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
  "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";

export function Input({ className = "", ...props }) {
  return <input className={cx(baseControl, className)} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={cx(baseControl, "pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cx(baseControl, "min-h-[120px]", className)}
      {...props}
    />
  );
}