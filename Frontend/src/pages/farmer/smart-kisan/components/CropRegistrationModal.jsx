import { useState } from "react";
import { X, Sprout, Wheat, Check, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { bookToken } from "../../../../services/farmerService.js";

const CROPS = [
  { id: "paddy", icon: Sprout, iconColor: "#3F8C4A", labelKey: "paddyLabel", hindiKey: "paddyHindi" },
  { id: "wheat", icon: Wheat, iconColor: "#D9A441", labelKey: "wheatLabel", hindiKey: "wheatHindi" },
];

export default function CropRegistrationModal({ onClose, onSuccess }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: crop select, 2: farmer details, 3: success
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    aadhaarNumber: "",
    village: "",
    district: "",
    landArea: "",
    bankAccount: "",
    ifscCode: "",
    centreName: "",
    slotDate: "",
    slotTime: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  const totalSteps = 2;

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Only sending fields the backend Booking model actually supports.
      // aadhaarNumber / bankAccount / ifscCode are intentionally NOT sent (no backend field for them yet).
      const payload = {
        cropType: selectedCrop,
        landArea: Number(form.landArea),
        centreName: form.centreName,
        slotDate: form.slotDate,
        slotTime: form.slotTime,
      };

      const res = await bookToken(payload);
      // bookToken uses the axios instance, so the backend JSON body is in res.data.
      // Handles both a direct booking object and a { success, booking } wrapped shape.
      const booking = res?.data?.booking ?? res?.data?.data ?? res?.data;
      setCreatedBooking(booking);

      setStep(3);
      if (typeof onSuccess === "function") {
        onSuccess(); // triggers Dashboard.jsx's loadAll() to refresh everything
      }
    } catch (err) {
      console.error("bookToken failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Booking failed. Please check details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCropMeta = CROPS.find((c) => c.id === selectedCrop);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-kisan-ink/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("cropRegistration.modalTitle")}
    >
      <div className="relative w-full max-w-xl bg-white rounded-xl2 shadow-soft max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-kisan-leaf sticky top-0 bg-white z-10 rounded-t-xl2">
          <div>
            <p className="text-[11px] font-semibold text-kisan-mute uppercase tracking-wide">
              {t("cropRegistration.stepLabel")} {step <= 2 ? step : totalSteps} {t("cropRegistration.of")}{" "}
              {totalSteps}
            </p>
            <h2 className="text-lg font-display font-bold text-kisan-ink mt-0.5">
              {t("cropRegistration.modalTitle")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("cropRegistration.close")}
            className="w-9 h-9 rounded-full flex items-center justify-center text-kisan-mute hover:bg-kisan-leaf hover:text-kisan-deep transition-colors focus-ring"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step progress bar */}
        {step <= 2 && (
          <div className="px-5 sm:px-6 pt-4 flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-kisan-green" : "bg-kisan-leaf"
                }`}
              />
            ))}
          </div>
        )}

        <div className="px-5 sm:px-6 py-5">
          {/* STEP 1 — Season & crop selection */}
          {step === 1 && (
            <div>
              <h3 className="text-base font-display font-bold text-kisan-ink">
                {t("cropRegistration.step1Title")}
              </h3>
              <p className="text-sm text-kisan-mute mt-1 mb-4">
                {t("cropRegistration.step1Subtitle")}
              </p>

              <div className="rounded-xl2 bg-kisan-wood p-5 sm:p-6">
                <h4 className="text-white text-lg sm:text-xl font-display font-bold mb-4">
                  {t("cropRegistration.seasonTitle")}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CROPS.map((crop) => {
                    const Icon = crop.icon;
                    const isSelected = selectedCrop === crop.id;
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCrop(crop.id)}
                        className={`relative bg-kisan-bg rounded-xl2 p-4 flex items-center gap-3 text-left transition-all focus-ring
                          ${isSelected ? "ring-4 ring-kisan-green" : "ring-2 ring-transparent hover:ring-kisan-wheat"}`}
                      >
                        {isSelected && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-kisan-green flex items-center justify-center shadow-card">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                        <Icon size={40} style={{ color: crop.iconColor }} strokeWidth={1.6} />
                        <span className="inline-flex items-center bg-kisan-woodDark text-white text-sm sm:text-base font-display font-bold px-3 py-2 rounded-lg leading-tight">
                          {t(`cropRegistration.${crop.hindiKey}`)}{" "}
                          <span className="font-normal text-white/85 ml-1">
                            ({t(`cropRegistration.${crop.labelKey}`)})
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  type="button"
                  disabled={!selectedCrop}
                  onClick={() => setStep(2)}
                  className="text-sm font-semibold text-white bg-kisan-green hover:bg-kisan-deep disabled:bg-kisan-leaf disabled:text-kisan-mute disabled:cursor-not-allowed transition-colors px-6 py-2.5 rounded-full focus-ring"
                >
                  {t("cropRegistration.continue")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Farmer details + booking form */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-base font-display font-bold text-kisan-ink">
                {t("cropRegistration.step2Title")}
              </h3>
              <p className="text-sm text-kisan-mute mt-1 mb-4">
                {t("cropRegistration.step2Subtitle")}
              </p>

              {selectedCropMeta && (
                <div className="inline-flex items-center gap-2 bg-kisan-leaf text-kisan-deep text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <selectedCropMeta.icon size={14} />
                  {t(`cropRegistration.${selectedCropMeta.hindiKey}`)} (
                  {t(`cropRegistration.${selectedCropMeta.labelKey}`)})
                </div>
              )}

              {error && (
                <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t("cropRegistration.fullName")}
                  placeholder={t("cropRegistration.fullNamePlaceholder")}
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  required
                  full
                />
                <Field
                  label={t("cropRegistration.mobileNumber")}
                  placeholder={t("cropRegistration.mobileNumberPlaceholder")}
                  value={form.mobileNumber}
                  onChange={updateField("mobileNumber")}
                  type="tel"
                  required
                />
                <Field
                  label={t("cropRegistration.aadhaarNumber")}
                  placeholder={t("cropRegistration.aadhaarNumberPlaceholder")}
                  value={form.aadhaarNumber}
                  onChange={updateField("aadhaarNumber")}
                  required
                />
                <Field
                  label={t("cropRegistration.village")}
                  placeholder={t("cropRegistration.villagePlaceholder")}
                  value={form.village}
                  onChange={updateField("village")}
                  required
                />
                <Field
                  label={t("cropRegistration.district")}
                  placeholder={t("cropRegistration.districtPlaceholder")}
                  value={form.district}
                  onChange={updateField("district")}
                  required
                />
                <Field
                  label={t("cropRegistration.landArea")}
                  placeholder={t("cropRegistration.landAreaPlaceholder")}
                  value={form.landArea}
                  onChange={updateField("landArea")}
                  type="number"
                  required
                />
                <Field
                  label={t("cropRegistration.bankAccount")}
                  placeholder={t("cropRegistration.bankAccountPlaceholder")}
                  value={form.bankAccount}
                  onChange={updateField("bankAccount")}
                  required
                />
                <Field
                  label={t("cropRegistration.ifscCode")}
                  placeholder={t("cropRegistration.ifscCodePlaceholder")}
                  value={form.ifscCode}
                  onChange={updateField("ifscCode")}
                  required
                />

                {/* NEW: booking-specific fields, required by backend Booking model */}
                <Field
                  label="Centre Name"
                  placeholder="e.g. Ghaziabad Procurement Centre"
                  value={form.centreName}
                  onChange={updateField("centreName")}
                  required
                  full
                />
                <Field
                  label="Slot Date"
                  value={form.slotDate}
                  onChange={updateField("slotDate")}
                  type="date"
                  required
                />
                <Field
                  label="Slot Time"
                  value={form.slotTime}
                  onChange={updateField("slotTime")}
                  type="time"
                  required
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-kisan-mute hover:text-kisan-deep transition-colors px-2 py-2 focus-ring rounded disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  {t("cropRegistration.back")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-kisan-green hover:bg-kisan-deep transition-colors px-6 py-2.5 rounded-full focus-ring disabled:opacity-70"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Booking..." : t("cropRegistration.submit")}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-kisan-leaf flex items-center justify-center mb-4">
                <CheckCircle2 size={34} className="text-kisan-green" />
              </div>
              <h3 className="text-lg font-display font-bold text-kisan-ink">
                {t("cropRegistration.successTitle")}
              </h3>
              {createdBooking?.tokenNumber && (
                <p className="text-sm text-kisan-mute mt-2">
                  Your token number:{" "}
                  <span className="font-semibold text-kisan-ink">
                    #{createdBooking.tokenNumber}
                  </span>
                </p>
              )}
              {selectedCropMeta && (
                <p className="text-sm text-kisan-mute mt-2">
                  {t("cropRegistration.registeredFor")}:{" "}
                  <span className="font-semibold text-kisan-ink">
                    {t(`cropRegistration.${selectedCropMeta.hindiKey}`)} (
                    {t(`cropRegistration.${selectedCropMeta.labelKey}`)})
                  </span>
                </p>
              )}
              <p className="text-sm text-kisan-mute mt-2 max-w-sm">
                {t("cropRegistration.successSubtitle")}
              </p>
              <button
                onClick={onClose}
                className="mt-6 text-sm font-semibold text-white bg-kisan-green hover:bg-kisan-deep transition-colors px-6 py-2.5 rounded-full focus-ring"
              >
                {t("cropRegistration.done")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = "text", required, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold text-kisan-mute uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full text-sm text-kisan-ink bg-kisan-bg border border-kisan-leaf rounded-lg px-3.5 py-2.5 focus-ring focus:border-kisan-green outline-none"
      />
    </label>
  );
}