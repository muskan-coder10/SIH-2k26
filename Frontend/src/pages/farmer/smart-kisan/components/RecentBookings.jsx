import { Sprout, Wheat, Leaf } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const CROP_ICON_MAP = {
  paddy: { icon: Sprout, color: "#3F8C4A" },
  wheat: { icon: Wheat, color: "#D9A441" },
};

const STATUS_STYLE = {
  pending: { label: "Pending", cls: "bg-kisan-wheatLight text-kisan-wheat" },
  verified: { label: "Verified", cls: "bg-kisan-leaf text-kisan-green" },
  weighed: { label: "Weighed", cls: "bg-kisan-leaf text-kisan-green" },
  procured: { label: "Procured", cls: "bg-kisan-leaf text-kisan-green" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

export default function RecentBookings({ bookings = [], loading }) {
  const { t } = useLanguage();

  // Most recent first
  const sorted = [...bookings].sort(
    (a, b) =>
      new Date(b.slotDate || b.createdAt || 0) - new Date(a.slotDate || a.createdAt || 0)
  );

  return (
    <section className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6">
      <h2 className="text-lg font-display font-bold text-kisan-ink mb-4">{t("recentBookings.title")}</h2>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-kisan-bg rounded animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-kisan-mute py-4">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-kisan-mute uppercase tracking-wide border-b border-kisan-leaf">
                <th className="py-2.5 pr-4">{t("recentBookings.date")}</th>
                <th className="py-2.5 pr-4">{t("recentBookings.crop")}</th>
                <th className="py-2.5 pr-4">{t("recentBookings.quantity")}</th>
                <th className="py-2.5 pr-4">{t("recentBookings.center")}</th>
                <th className="py-2.5 pr-4">{t("recentBookings.token")}</th>
                <th className="py-2.5 pr-4">{t("recentBookings.status")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => {
                const cropMeta = CROP_ICON_MAP[b.cropType?.toLowerCase()] || {
                  icon: Leaf,
                  color: "#5B7A57",
                };
                const Icon = cropMeta.icon;
                const statusMeta = STATUS_STYLE[b.status] || {
                  label: b.status,
                  cls: "bg-kisan-bg text-kisan-mute",
                };
                const cropName =
                  b.cropType?.charAt(0).toUpperCase() + b.cropType?.slice(1);
                const dateLabel = b.slotDate
                  ? new Date(b.slotDate).toLocaleDateString()
                  : "—";

                return (
                  <tr
                    key={b._id}
                    tabIndex={0}
                    onClick={() => console.log(`Open booking: ${b._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        console.log(`Open booking: ${b._id}`);
                      }
                    }}
                    className="border-b border-kisan-leaf/70 last:border-0 cursor-pointer odd:bg-kisan-bg/40 hover:bg-kisan-leaf/60 transition-colors focus-ring"
                  >
                    <td className="py-3 pr-4 text-kisan-ink whitespace-nowrap">
                      {dateLabel} {b.slotTime || ""}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#EEF3EC" }}
                        >
                          <Icon size={16} style={{ color: cropMeta.color }} />
                        </span>
                        <span className="text-kisan-ink">{cropName}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-kisan-ink">
                      {["weighed", "procured"].includes(b.status)
                        ? `${b.quantity} kg`
                        : `${b.landArea} acres`}
                    </td>
                    <td className="py-3 pr-4 text-kisan-ink">{b.centreName}</td>
                    <td className="py-3 pr-4 text-kisan-ink font-semibold">
                      #{b.tokenNumber}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta.cls}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}