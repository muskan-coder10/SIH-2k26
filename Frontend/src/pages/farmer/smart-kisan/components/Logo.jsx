export default function Logo({ size = 40, showText = true, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/images/anndisha-logo11.png"
        alt="AnnDisha logo"
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
      {showText && (
        <div className="leading-tight">
          <p className={`font-display font-bold text-[17px] ${light ? "text-white" : "text-kisan-deep"}`}>
            <span className={light ? "text-white" : "text-kisan-deep"}>Ann</span>
            <span className={light ? "text-kisan-wheat" : "text-kisan-orange"}>Disha</span>
          </p>
          <p className={`text-[11px] font-medium ${light ? "text-white/70" : "text-kisan-mute"}`}>
            Smart Procurement Portal
          </p>
        </div>
      )}
    </div>
  );
}
