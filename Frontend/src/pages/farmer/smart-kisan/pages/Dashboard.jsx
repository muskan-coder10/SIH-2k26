import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Mail, Phone, Globe, LogOut } from "lucide-react";
import HeroSection from "../components/HeroSection.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import LiveQueue from "../components/LiveQueue.jsx";
import Notifications from "../components/Notifications.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import MyCrops from "../components/MyCrops.jsx";
import RecentBookings from "../components/RecentBookings.jsx";
import FarmerProfile from "../components/FarmerProfile.jsx";
import CropRegistration from "../components/CropRegistration.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { getMyToken, getMySchedule, getMyPayments } from "../../../../services/farmerService";

const statusStageMap = {
  pending: "Pending",
  verified: "Verified",
  weighed: "Weighed",
  procured: "Procured",
  rejected: "Rejected",
};

const statusDetailMap = {
  pending: "Waiting for officer verification",
  verified: "Verified — awaiting weighing",
  weighed: "Weighed — awaiting final procurement",
  procured: "Procurement complete",
  rejected: "Booking was rejected",
};

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    setLoading(true);
    Promise.allSettled([getMyToken(), getMySchedule(), getMyPayments()]).then(
      ([tokenRes, scheduleRes, paymentsRes]) => {
        if (tokenRes.status === "fulfilled") setCurrentBooking(tokenRes.value.data);
        if (scheduleRes.status === "fulfilled") setBookings(scheduleRes.value.data);
        if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value.data);
        setLoading(false);
      }
    );
  };

  useEffect(() => { loadAll(); }, []);

  const totalQuantity = bookings
    .filter((b) => ["weighed", "procured"].includes(b.status))
    .reduce((sum, b) => sum + (b.quantity || 0), 0);
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Handles clicks from SummaryCards ("Live Queue →" / "View Details →" / "Book Now")
  const handleSummaryAction = (target) => {
    const idMap = {
      queue: "my-tokens",
      status: "procurement-status",
      book: "crop-registration",
    };
    const id = idMap[target];
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div id="dashboard" className="space-y-6 px-4 sm:px-8 py-6 max-w-[1400px] mx-auto scroll-mt-24">
      <HeroSection />

      <SummaryCards
        currentBooking={currentBooking}
        loading={loading}
        onAction={handleSummaryAction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <LiveQueue currentBooking={currentBooking} loading={loading} />
        <Notifications bookings={bookings} payments={payments} loading={loading} />
      </div>

      <HowItWorks />
      <MyCrops bookings={bookings} loading={loading} />
      <RecentBookings bookings={bookings} loading={loading} />

      {/* Procurement Status */}
      <section id="procurement-status" className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6 scroll-mt-24">
        <h2 className="text-lg font-display font-bold text-kisan-ink mb-4">Procurement Status</h2>
        {loading ? (
          <div className="h-16 bg-kisan-bg rounded animate-pulse" />
        ) : currentBooking ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-kisan-leaf flex items-center justify-center text-kisan-green font-bold shrink-0">
              #{currentBooking.tokenNumber}
            </div>
            <div>
              <p className="font-semibold text-kisan-ink">
                {statusStageMap[currentBooking.status] || currentBooking.status}
              </p>
              <p className="text-sm text-kisan-mute mt-0.5">
                {statusDetailMap[currentBooking.status] || ""}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-kisan-mute">No active booking yet. Book a slot to see status here.</p>
        )}
      </section>

      <FarmerProfile
        totalCrops={bookings.length}
        totalQuantity={totalQuantity}
        totalPaid={totalPaid}
      />

      {/* Help Center */}
      <section id="help-center" className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6 scroll-mt-24">
        <h2 className="text-lg font-display font-bold text-kisan-ink mb-4 flex items-center gap-2">
          <HelpCircle size={20} className="text-kisan-green" /> Help Center
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-kisan-ink">
            <Phone size={16} className="text-kisan-mute shrink-0" />
            <span>Helpline: 1800-XXX-XXXX (Toll-free, 9 AM – 6 PM)</span>
          </div>
          <div className="flex items-center gap-3 text-kisan-ink">
            <Mail size={16} className="text-kisan-mute shrink-0" />
            <span>Email: support@anndisha.gov.in</span>
          </div>
          <p className="text-kisan-mute pt-2">
            For issues with bookings, payments, or procurement status, please raise a complaint from
            the Complaints section, or contact your nearest procurement centre directly.
          </p>
        </div>
      </section>

      <CropRegistration onSuccess={loadAll} />

      {/* Settings */}
      <section id="settings" className="bg-white rounded-xl2 border border-kisan-leaf shadow-card p-5 sm:p-6 scroll-mt-24">
        <h2 className="text-lg font-display font-bold text-kisan-ink mb-4">Settings</h2>
        <div className="flex items-center justify-between py-3 border-b border-kisan-leaf/60">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-kisan-mute" />
            <span className="text-sm text-kisan-ink">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-kisan-leaf rounded-lg px-3 py-1.5 bg-kisan-bg text-kisan-ink focus-ring"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors focus-ring"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </section>
    </div>
  );
}