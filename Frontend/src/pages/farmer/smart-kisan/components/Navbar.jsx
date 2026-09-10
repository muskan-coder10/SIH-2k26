import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, Globe, ChevronDown, CheckCircle2, Clock, XCircle, IndianRupee } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import useAuth from "../../../../hooks/useAuth";
import { getMySchedule, getMyPayments } from "../../../../services/farmerService";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "#B9822C", text: (b) => `Slot booked at ${b.centreName || "centre"}, awaiting verification.` },
  verified: { icon: CheckCircle2, color: "#2F6B3C", text: (b) => `Token #${b.tokenNumber} verified. Please reach the centre.` },
  weighed: { icon: CheckCircle2, color: "#2F6B3C", text: (b) => `Token #${b.tokenNumber} has been weighed.` },
  procured: { icon: CheckCircle2, color: "#2F6B3C", text: (b) => `Token #${b.tokenNumber} procurement completed.` },
  rejected: { icon: XCircle, color: "#B93C3C", text: (b) => `Token #${b.tokenNumber} was rejected.` },
};

const PAYMENT_CONFIG = {
  pending: { icon: IndianRupee, color: "#B9822C", text: (p) => `Payment of ₹${p.amount} is pending.` },
  processing: { icon: IndianRupee, color: "#B9822C", text: (p) => `Payment of ₹${p.amount} is processing.` },
  paid: { icon: IndianRupee, color: "#2F6B3C", text: (p) => `Payment of ₹${p.amount} completed.` },
};

export default function Navbar({ onMenuClick }) {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function loadNotifications() {
    setNotifLoading(true);
    Promise.allSettled([getMySchedule(), getMyPayments()]).then(([scheduleRes, paymentsRes]) => {
      const bookings = scheduleRes.status === "fulfilled" ? scheduleRes.value.data || [] : [];
      const payments = paymentsRes.status === "fulfilled" ? paymentsRes.value.data || [] : [];

      const bookingItems = bookings
        .filter((b) => STATUS_CONFIG[b.status])
        .map((b) => ({
          id: `booking-${b._id}`,
          sortKey: b.updatedAt || b.createdAt || b.slotDate || "",
          ...STATUS_CONFIG[b.status],
          message: STATUS_CONFIG[b.status].text(b),
        }));

      const paymentItems = payments
        .filter((p) => PAYMENT_CONFIG[p.status])
        .map((p) => ({
          id: `payment-${p._id}`,
          sortKey: p.paidOn || p.updatedAt || p.createdAt || "",
          ...PAYMENT_CONFIG[p.status],
          message: PAYMENT_CONFIG[p.status].text(p),
        }));

      const items = [...bookingItems, ...paymentItems]
        .sort((a, b) => new Date(b.sortKey) - new Date(a.sortKey))
        .slice(0, 4);

      setNotifItems(items);
      setNotifLoading(false);
    });
  }

  useEffect(() => {
    loadNotifications();
    window.addEventListener("anndisha:refresh-notifications", loadNotifications);
    return () => window.removeEventListener("anndisha:refresh-notifications", loadNotifications);
  }, []);

  const goToDashboardNotifications = () => {
    setNotifOpen(false);
    document.getElementById("notifications")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProfileMenuClick = (key) => {
    setProfileOpen(false);
    if (key === "viewProfile") {
      document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" });
    } else if (key === "logout") {
      logout();
      navigate("/farmer/login");
    }
    // "settings" — no page built yet, no-op for now
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b-2 border-kisan-orange">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <button
          className="lg:hidden text-kisan-deep p-1.5 rounded-lg hover:bg-kisan-leaf focus-ring"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kisan-mute" />
          <input
            type="text"
            placeholder={t("search.placeholder")}
            className="w-full bg-kisan-bg border border-kisan-leaf rounded-full pl-10 pr-4 py-2.5 text-sm
            placeholder:text-kisan-mute focus-ring focus:border-kisan-green"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className="flex items-center gap-1.5 text-sm font-medium text-kisan-mute hover:text-kisan-deep px-2 py-1.5 rounded-lg hover:bg-kisan-leaf focus-ring cursor-pointer"
            >
              <Globe size={17} />
              <span className="hidden sm:inline">{LANG_OPTIONS.find((o) => o.code === lang)?.label}</span>
              <ChevronDown size={14} className="hidden sm:inline" />
            </button>
            {langOpen && (
              <div
                role="listbox"
                className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-soft border border-kisan-leaf py-1.5 z-10"
              >
                {LANG_OPTIONS.map((o) => (
                  <button
                    key={o.code}
                    role="option"
                    aria-selected={lang === o.code}
                    onClick={() => {
                      setLang(o.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left text-sm px-3.5 py-2 hover:bg-kisan-leaf ${
                      lang === o.code ? "text-kisan-green font-semibold" : "text-kisan-ink"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-full hover:bg-kisan-leaf text-kisan-deep focus-ring"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {notifItems.length > 0 && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-kisan-wheat rounded-full ring-2 ring-white" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-soft border border-kisan-leaf py-2 z-10">
                <p className="px-4 py-1.5 text-xs font-semibold text-kisan-mute uppercase tracking-wide">
                  {t("nav.notifications")}
                </p>

                {notifLoading ? (
                  <div className="px-4 py-3 space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-8 bg-kisan-bg rounded animate-pulse" />
                    ))}
                  </div>
                ) : notifItems.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-kisan-mute">No notifications yet.</div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto">
                    {notifItems.map((n) => {
                      const Icon = n.icon;
                      return (
                        <li key={n.id} className="px-4 py-2 flex items-start gap-2.5 hover:bg-kisan-bg">
                          <Icon size={15} style={{ color: n.color }} className="mt-0.5 shrink-0" />
                          <span className="text-sm text-kisan-ink leading-snug">{n.message}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <button
                  onClick={goToDashboardNotifications}
                  className="w-full text-left px-4 pt-2 text-sm font-semibold text-kisan-green hover:text-kisan-deep"
                >
                  View all on dashboard →
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-kisan-leaf focus-ring"
            >
              <div className="w-9 h-9 rounded-full bg-kisan-green text-white flex items-center justify-center font-semibold border-2 border-kisan-green">
                {(user?.name || "F").charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-left">
                <span className="block text-sm font-semibold text-kisan-ink leading-none">
                  {user?.name || "Farmer"}
                </span>
                <span className="block text-[11px] text-kisan-mute mt-0.5">{t("common.farmerRole")}</span>
              </span>
              <ChevronDown size={14} className="hidden md:block text-kisan-mute" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft border border-kisan-leaf py-1.5 z-10">
                {["viewProfile", "settings", "logout"].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleProfileMenuClick(key)}
                    className="w-full text-left text-sm px-3.5 py-2 hover:bg-kisan-leaf text-kisan-ink cursor-pointer"
                  >
                    {t(`profileMenu.${key}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}