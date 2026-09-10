import { useLanguage } from "../i18n/LanguageContext.jsx";

const statusLabelMap = {
  pending: "Pending",
  verified: "Verified",
  weighed: "Weighed",
  procured: "Procured",
  rejected: "Rejected",
};

export default function LiveQueue({ currentBooking, loading }) {
  const { t } = useLanguage();
  const hasBooking = Boolean(currentBooking);

  return (
    <div
      id="my-tokens"
      className="relative bg-white rounded-xl2 border border-kisan-leaf shadow-card overflow-hidden h-full scroll-mt-24"
    >
      <div className="bg-kisan-deep h-16 flex items-center px-5">
        <h3 className="text-white font-display font-semibold">
          {t("liveQueuePanel.title")}
        </h3>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-kisan-leaf rounded w-1/2" />
            <div className="h-24 bg-kisan-leaf rounded-xl max-w-[220px]" />
          </div>
        ) : !hasBooking ? (
          <div className="text-center py-6">
            <p className="text-sm text-kisan-mute">No active token right now.</p>
            <p className="text-xs text-kisan-mute mt-1">
              Register a crop to get your token here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-kisan-ink">
              {currentBooking.centreName}
            </p>

            <div className="mt-4 bg-kisan-leaf rounded-xl p-4 text-center max-w-[220px] mx-auto sm:mx-0">
              <p className="text-xs font-semibold text-kisan-green uppercase tracking-wide">
                Your Token
              </p>
              <p className="text-3xl font-display font-bold text-kisan-deep mt-1">
                #{currentBooking.tokenNumber}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-kisan-bg">
                <span className="text-kisan-mute">Status</span>
                <span className="font-semibold text-kisan-ink">
                  {statusLabelMap[currentBooking.status] || currentBooking.status}
                </span>
              </span>
              {(currentBooking.slotDate || currentBooking.slotTime) && (
                <span className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-kisan-bg">
                  <span className="text-kisan-mute">Slot</span>
                  <span className="font-semibold text-kisan-ink">
                    {currentBooking.slotDate
                      ? new Date(currentBooking.slotDate).toLocaleDateString()
                      : ""}{" "}
                    {currentBooking.slotTime || ""}
                  </span>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}