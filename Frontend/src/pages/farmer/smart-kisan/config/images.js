// Centralized image configuration.
// All external imagery is sourced from Unsplash (free-to-use license) and
// kept in one place so it can be swapped for local /assets files later.
// To use local files instead: drop images into src/assets/ and import them,
// then replace the corresponding URL below.

const u = (id, w = 1200, q = 80, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}${extra}`;

export const IMAGES = {
  // Wide hero background — wheat field with warm light
  heroField: u("photo-1500937386664-56d1dfef3854", 1600),

  // Sidebar promo card — farmer standing in crop field
  sidebarFarmer: u("photo-1574943320219-553eb213f72d", 700),

  // Navbar / profile avatar — realistic close-up portrait of an Indian farmer
  farmerAvatar: u("photo-1579406842270-ea87c39a8a12", 200, 80, "&crop=faces"),

  // Larger farmer profile photo — same realistic portrait, higher resolution
  farmerProfileLarge: u("photo-1579406842270-ea87c39a8a12", 800, 80, "&crop=faces"),

  // Farmers waiting at procurement centre (grain bags, counter)
  procurementWaiting: u("photo-1591857177580-dc82b9ac4e1e", 700),

  // Crop images
  wheatField: u("photo-1500382017468-9049fed747ef", 700),
  paddyField: u("photo-1560493676-04071c5f467b", 700),

  // Procurement centre large banner
  procurementCentreLarge: u("photo-1464226184884-fa280b87c399", 1400),

  // Promotional banner — farm / wheat field
  bannerField: u("photo-1544427920-c49ccfb85579", 1600),

  // Crop registration banner — fresh green paddy field, aerial view (new season)
  newSeasonField: u("photo-1668177706457-5e53ed1d989b", 1600),

  // Tractor / farm scene (how it works, misc)
  tractorField: u("photo-1523348837708-15d4a09cfac2", 700),

  // Rural road / village
  ruralRoad: u("photo-1508615070457-7baeba4003ab", 700),

  // Logo (custom SVG, not external) — see components/Logo.jsx
};

export default IMAGES;
