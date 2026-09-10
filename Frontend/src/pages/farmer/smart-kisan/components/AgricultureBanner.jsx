import { IMAGES } from "../config/images.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function AgricultureBanner() {
  const { t } = useLanguage();
  return (
    <section className="relative rounded-xl2 overflow-hidden min-h-[200px] flex items-center">
      <img
        src={IMAGES.bannerField}
        alt="Wheat field with clear sky, Indian farmland"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-kisan-deep/85 to-kisan-deep/40" />
      <div className="relative px-6 py-8 sm:px-10 max-w-lg">
        <h2 className="text-white text-xl sm:text-2xl font-display font-bold leading-snug">
          {t("banner.title1")}
          <br />
          {t("banner.title2")}
        </h2>
        <p className="text-white/85 text-sm mt-3 leading-relaxed">
          {t("banner.subtitle")}
        </p>
        <button className="mt-5 text-sm font-semibold text-kisan-deep bg-white hover:bg-kisan-wheatLight transition-colors px-5 py-2.5 rounded-full focus-ring">
          {t("banner.bookNewSlot")}
        </button>
      </div>
    </section>
  );
}
