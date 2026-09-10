import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Logo from "./Logo.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const socials = [Facebook, Instagram, Twitter, Youtube];

export default function Footer() {
  const { t } = useLanguage();
  const links = t("footer.links");

  return (
    <footer className="bg-white border-t border-kisan-leaf mt-10">
      <div className="px-4 sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <Logo size={34} />
          <p className="text-xs text-kisan-mute mt-2">{t("footer.tagline")}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-kisan-mute">
          {links.map((l) => (
            <a key={l} href="#" className="hover:text-kisan-green focus-ring rounded">
              {l}
            </a>
          ))}
        </nav>

        <div className="flex gap-3">
          {socials.map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="Social link"
              className="w-9 h-9 rounded-full bg-kisan-leaf flex items-center justify-center text-kisan-green hover:bg-kisan-green hover:text-white transition-colors focus-ring"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-kisan-mute pb-5">
        © {new Date().getFullYear()} AnnDisha. {t("footer.rights")}
      </p>
    </footer>
  );
}
