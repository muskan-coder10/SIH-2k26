import { Ticket, ClipboardCheck } from "lucide-react";
import StatCard from "./StatCard.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const statusStageMap = {
  pending: "Pending",
  verified: "Verified",
  weighed: "Weighed",
  procured: "Procured",
  rejected: "Rejected",
};

const statusDetailMap = {
  pending: "Waiting for officer verification",
  verified: "Verified — awaiting weighing",
  weighed: "Weighed — awaiting final procurement",
  procured: "Procurement complete",
  rejected: "Booking was rejected",
};

export default function SummaryCards({ currentBooking, loading, onAction }) {
  const { t } = useLanguage();

  const hasBooking = Boolean(currentBooking);

  const tokenTitle = loading
    ? "…"
    : hasBooking
    ? `#${currentBooking.tokenNumber}`
    : "No token yet";

  const tokenSubtitle = loading
    ? t("cards.loading") || "Loading..."
    : hasBooking
    ? `${currentBooking.slotDate ? new Date(currentBooking.slotDate).toLocaleDateString() : ""} ${currentBooking.slotTime || ""}`.trim() ||
      currentBooking.centreName
    : "Book a slot to get started";

  const statusTitle = loading
    ? "…"
    : hasBooking
    ? statusStageMap[currentBooking.status] || currentBooking.status
    : "—";

  const statusSubtitle = loading
    ? t("cards.loading") || "Loading..."
    : hasBooking
    ? statusDetailMap[currentBooking.status] || ""
    : "No active booking";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        icon={Ticket}
        iconBg="#F3E3BE"
        iconColor="#B9822C"
        label={t("cards.currentToken")}
        title={tokenTitle}
        subtitle={tokenSubtitle}
        buttonLabel={hasBooking ? t("cards.liveQueue") : t("cards.bookNow") || "Book Now"}
        onAction={() => onAction(hasBooking ? "queue" : "book")}
      />
      <StatCard
        icon={ClipboardCheck}
        iconBg="#E4EEF7"
        iconColor="#2E6499"
        label={t("cards.procurementStatus")}
        title={statusTitle}
        subtitle={statusSubtitle}
        buttonLabel={t("cards.viewDetails")}
        onAction={() => onAction("status")}
      />
    </section>
  );
}