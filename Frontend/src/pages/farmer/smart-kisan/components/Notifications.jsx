import { CheckCircle2, IndianRupee, Clock, XCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    bg: "#F3E3BE",
    color: "#B9822C",
    text: (b) =>
      `Your slot at ${b.centreName || "the centre"} is booked for ${
        b.slotDate ? new Date(b.slotDate).toLocaleDateString() : "your chosen date"
      }${b.slotTime ? `, ${b.slotTime}` : ""}. Waiting for verification.`,
  },
  verified: {
    icon: CheckCircle2,
    bg: "#EAF4E7",
    color: "#2F6B3C",
    text: (b) => `Your token #${b.tokenNumber} has been verified. Please reach the centre.`,
  },
  weighed: {
    icon: CheckCircle2,
    bg: "#EAF4E7",
    color: "#2F6B3C",
    text: (b) => `Your crop for token #${b.tokenNumber} has been weighed.`,
  },
  procured: {
    icon: CheckCircle2,
    bg: "#EAF4E7",
    color: "#2F6B3C",
    text: (b) => `Token #${b.tokenNumber} procurement completed successfully.`,
  },
  rejected: {
    icon: XCircle,
    bg: "#FBE3E3",
    color: "#B93C3C",
    text: (b) => `Your booking for token #${b.tokenNumber} was rejected.`,
  },
};

const PAYMENT_CONFIG = {
  pending: {
    icon: IndianRupee,
    bg: "#F3E3BE",
    color: "#B9822C",
    text: (p) => `Payment of ₹${p.amount} is pending.`,
  },
  processing: {
    icon: IndianRupee,
    bg: "#F3E3BE",
    color: "#B9822C",
    text: (p) => `Payment of ₹${p.amount} is processing.`,
  },
  paid: {
    icon: IndianRupee,
    bg: "#EAF4E7",
    color: "#2F6B3C",
    text: (p) => `Payment of ₹${p.amount} has been completed.`,
  },
};

export default function Notifications({ bookings = [], payments = [], loading }) {
  const { t } = useLanguage();

  // Build notification items from bookings + payments, most recent first
  const bookingItems = [...bookings]
    .filter((b) => STATUS_CONFIG[b.status])
    .map((b) => ({
      id: `booking-${b._id}`,
      sortKey: b.updatedAt || b.createdAt || b.slotDate || "",
      ...STATUS_CONFIG[b.status],
      message: STATUS_CONFIG[b.status].text(b),
    }));

  const paymentItems = [...payments]
    .filter((p) => PAYMENT_CONFIG[p.status])
    .map((p) => ({
      id: `payment-${p._id}`,
      sortKey: p.paidOn || p.updatedAt || p.createdAt || "",
      ...PAYMENT_CONFIG[p.status],
      message: PAYMENT_CONFIG[p.status].text(p),
    }));

  const items = [...bookingItems, ...paymentItems]
    .sort((a, b) => new Date(b.sortKey) - new Date(a.sortKey))
    .slice(0, 5);

  return (
    <section
      id="notifications"
      className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6 scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-kisan-ink">
          {t("notifications.title")}
        </h2>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-kisan-bg rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-kisan-mute py-2">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <li
                key={n.id}
                className="flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-kisan-bg transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: n.bg }}
                >
                  <Icon size={16} style={{ color: n.color }} />
                </div>
                <p className="text-sm text-kisan-ink leading-relaxed pt-1.5">{n.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}