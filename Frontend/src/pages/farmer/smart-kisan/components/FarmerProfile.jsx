import { useLanguage } from "../i18n/LanguageContext.jsx";
import useAuth from "../../../../hooks/useAuth";

export default function FarmerProfile({ totalCrops, totalQuantity, totalPaid }) {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section id="profile" className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="w-24 h-24 rounded-2xl bg-kisan-green text-white flex items-center justify-center text-3xl font-bold shrink-0">
          {(user?.name || "F").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg text-kisan-ink">{user?.name}</h3>
          <p className="text-sm text-kisan-mute mt-0.5">
            {user?.phone} {user?.village && `• ${t("farmerProfile.village")}: ${user.village}`} {user?.district && `• ${t("farmerProfile.district")}: ${user.district}`}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-kisan-bg rounded-xl p-3 text-center border border-transparent hover:border-kisan-leaf transition-colors">
              <p className="text-lg font-display font-bold text-kisan-deep">{totalCrops}</p>
              <p className="text-[11px] text-kisan-mute mt-0.5">{t("farmerProfile.totalCrops")}</p>
            </div>
            <div className="bg-kisan-bg rounded-xl p-3 text-center border border-transparent hover:border-kisan-leaf transition-colors">
              <p className="text-lg font-display font-bold text-kisan-deep">{totalQuantity} kg</p>
              <p className="text-[11px] text-kisan-mute mt-0.5">{t("farmerProfile.totalQuantity")}</p>
            </div>
            <div className="bg-kisan-bg rounded-xl p-3 text-center border border-transparent hover:border-kisan-leaf transition-colors">
              <p className="text-lg font-display font-bold text-kisan-deep">₹{totalPaid.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-kisan-mute mt-0.5">{t("farmerProfile.totalPayments")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}