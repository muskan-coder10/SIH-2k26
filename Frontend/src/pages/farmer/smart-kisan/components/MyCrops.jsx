import CropCard from "./CropCard.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function MyCrops({ bookings = [], loading }) {
  const { t } = useLanguage();

  return (
    <section id="my-crops" className="scroll-mt-24">
      <h2 className="text-lg font-display font-bold text-kisan-ink mb-4">{t("myCrops.title")}</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-kisan-bg rounded-xl2 animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-6 text-center">
          <p className="text-sm text-kisan-mute">
            No crops registered yet. Book a slot to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <CropCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}