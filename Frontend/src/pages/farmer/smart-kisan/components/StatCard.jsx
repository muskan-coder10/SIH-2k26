export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  title,
  subtitle,
  buttonLabel,
  onAction,
}) {
  return (
    <div
      className="bg-white rounded-xl2 border border-kisan-leaf shadow-card hover:shadow-soft transition-shadow p-5 flex flex-col justify-between h-full border-l-4"
      style={{ borderLeftColor: iconColor }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-kisan-mute uppercase tracking-wide">
            {label}
          </p>
          <p className="text-lg font-display font-bold text-kisan-ink mt-1.5">
            {title}
          </p>
          {subtitle && (
            <p className="text-sm text-kisan-mute mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <button
        onClick={onAction}
        className="mt-4 text-sm font-semibold text-kisan-green hover:text-kisan-deep self-start focus-ring rounded"
      >
        {buttonLabel} →
      </button>
    </div>
  );
}
