import {
  LayoutDashboard,
  ClipboardList,
  Ticket,
  Wheat,
  ClipboardCheck,
  Bell,
  HelpCircle,
  UserCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo.jsx";
import { navItems } from "../data/mockData.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const ICONS = {
  LayoutDashboard,
  ClipboardList,
  Ticket,
  Wheat,
  ClipboardCheck,
  Bell,
  HelpCircle,
  UserCircle,
  Settings,
  LogOut,
};

export default function Sidebar({ activeItem, onNavigate, isOpen, onClose }) {
  const { t } = useLanguage();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-kisan-green border-r border-kisan-deep/30 z-50
        flex flex-col transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 bg-kisan-deep">
          <Logo size={38} light />
          <button
            className="lg:hidden text-white/80 focus-ring rounded p-1"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium
                transition-colors focus-ring cursor-pointer
                ${
                  active
                    ? "bg-kisan-wheat text-kisan-deep shadow-card"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                <span className="truncate">{t(`nav.${item.id}`)}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 text-[10px] text-white/50 border-t border-white/10">
          © {new Date().getFullYear()} AnnDisha
        </div>
      </aside>
    </>
  );
}
