import { IMAGES } from "../config/images.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import useAuth from "../../../../hooks/useAuth";

export default function HeroSection() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section className="relative rounded-xl2 overflow-hidden min-h-[220px] flex items-center">
      <img
        src={IMAGES.heroField}
        alt="Golden wheat field in rural India"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-kisan-deep/90 via-kisan-deep/70 to-kisan-green/30" />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10 max-w-xl">
        <h1 className="text-white text-2xl sm:text-3xl font-display font-bold leading-tight">
          {t("hero.welcome")}
          <br />
          {user?.name || "Farmer"} 👋
        </h1>
        <p className="text-white/85 text-sm sm:text-[15px] mt-3 leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
}