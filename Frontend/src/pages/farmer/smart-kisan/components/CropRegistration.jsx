import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { IMAGES } from "../config/images.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import CropRegistrationModal from "./CropRegistrationModal.jsx";

export default function CropRegistration({ onSuccess }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section
        id="crop-registration"
        className="relative rounded-xl2 overflow-hidden min-h-[200px] flex items-center scroll-mt-24"
      >
        <img
          src={IMAGES.newSeasonField}
          alt="Fresh green paddy field, aerial view, new farming season"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kisan-wood/90 to-kisan-woodDark/50" />
        <div className="relative px-6 py-8 sm:px-10 max-w-lg">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-3">
            <ClipboardList size={20} className="text-white" />
          </div>
          <h2 className="text-white text-xl sm:text-2xl font-display font-bold leading-snug">
            {t("cropRegistration.title1")}
            <br />
            {t("cropRegistration.title2")}
          </h2>
          <p className="text-white/85 text-sm mt-3 leading-relaxed">
            {t("cropRegistration.subtitle")}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-5 text-sm font-semibold text-kisan-woodDark bg-white hover:bg-kisan-wheatLight transition-colors px-5 py-2.5 rounded-full focus-ring"
          >
            {t("cropRegistration.startRegistration")}
          </button>
        </div>
      </section>

      {isOpen && (
        <CropRegistrationModal
          onClose={() => setIsOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}