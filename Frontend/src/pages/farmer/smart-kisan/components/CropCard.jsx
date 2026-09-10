import { Sprout, Wheat, Leaf } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const CROP_ICON_MAP = {
  paddy: { icon: Sprout, color: "#3F8C4A", bg: "#EAF4E7" },
  wheat: { icon: Wheat, color: "#D9A441", bg: "#FBF2DE" },
};

const STATUS_STYLE = {
  pending: { label: "Pending", cls: "bg-kisan-wheatLight text-kisan-wheat" },
  verified: { label: "Verified", cls: "bg-kisan-leaf text-kisan-green" },
  weighed: { label: "Weighed", cls: "bg-kisan-leaf text-kisan-green" },
  procured: { label: "Procured", cls: "bg-kisan-leaf text-kisan-green" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

export default function CropCard({ booking }) {
  const { t } = useLanguage();

  const cropMeta = CROP_ICON_MAP[booking.cropType?.toLowerCase()] || {
    icon: Leaf,
    color: "#5B7A57",
    bg: "#EEF3EC",
  };
  const Icon = cropMeta.icon;

  const statusMeta = STATUS_STYLE[booking.status] || {
    label: booking.status,
    cls: "bg-kisan-bg text-kisan-mute",
  };

  const cropName =
    booking.cropType?.charAt(0).toUpperCase() + booking.cropType?.slice(1);

  const expectedDate = booking.slotDate
    ? new Date(booking.slotDate).toLocaleDateString()
    : "—";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => console.log(`Open crop booking: ${booking._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          console.log(`Open crop booking: ${booking._id}`);
        }
      }}
      className="group bg-white rounded-xl2 border border-kisan-leaf shadow-card overflow-hidden cursor-pointer transition-all hover:shadow-soft hover:-translate-y-0.5 focus-ring"
    >
      {/* Icon banner replaces the missing crop image */}
      <div
        className="w-full h-32 flex items-center justify-center"
        style={{ backgroundColor: cropMeta.bg }}
      >
        <Icon size={48} style={{ color: cropMeta.color }} strokeWidth={1.5} />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-kisan-ink">{cropName}</h3>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusMeta.cls}`}>
            {statusMeta.label}
          </span>
        </div>
        {["weighed", "procured"].includes(booking.status) ? (
          <p className="text-sm text-kisan-mute mt-1">{booking.quantity} kg</p>
        ) : (
          <p className="text-sm text-kisan-mute mt-1">
            {booking.landArea} acres · Pending weighing
          </p>
        )}
        <p className="text-xs text-kisan-mute mt-2">
          {t("myCrops.expectedProcurement")}:{" "}
          <span className="font-medium text-kisan-ink">{expectedDate}</span>
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`View details: ${booking._id}`);
          }}
          className="mt-4 w-full text-sm font-semibold text-white bg-kisan-green hover:bg-kisan-deep transition-colors py-2 rounded-full focus-ring"
        >
          {t("myCrops.viewDetails")}
        </button>
      </div>
    </div>
  );
}