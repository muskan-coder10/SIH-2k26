import { UserPlus, CalendarCheck, Ticket, Building2, Wallet, ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const ICONS = [UserPlus, CalendarCheck, Ticket, Building2, Wallet];

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = t("howItWorks.steps");

  return (
    <section className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6">
      <h2 className="text-lg font-display font-bold text-kisan-ink mb-6">{t("howItWorks.title")}</h2>

      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-2">
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <div key={i} className="flex md:flex-1 items-center md:flex-col md:text-center gap-4 md:gap-0">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-kisan-leaf flex items-center justify-center">
                  <Icon size={24} className="text-kisan-green" />
                </div>
              </div>
              <div className="md:mt-3">
                <p className="text-sm font-display font-semibold text-kisan-ink">
                  {step.title}
                </p>
                <p className="text-xs text-kisan-mute mt-0.5 max-w-[140px] md:mx-auto">
                  {step.detail}
                </p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  size={18}
                  className="hidden md:block text-kisan-leaf ml-auto md:ml-0 md:mt-[-38px] md:translate-x-[calc(50%+28px)]"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
