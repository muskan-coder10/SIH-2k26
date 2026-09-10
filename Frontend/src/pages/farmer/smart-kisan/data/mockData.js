import { IMAGES } from "../config/images.js";

export const farmer = {
  name: "Ramesh Yadav",
  role: "Farmer",
  farmerId: "SK-10234",
  village: "Rampur",
  district: "Siddharth Nagar",
  totalCrops: 2,
  totalQuantity: "38 Quintal",
  totalPayments: "₹82,500",
  avatar: IMAGES.farmerAvatar,
  photoLarge: IMAGES.farmerProfileLarge,
};

export const currentToken = {
  number: 23,
  ahead: 5,
};

export const procurementStatus = {
  stage: "Crop Verified",
  detail: "In Progress",
};

export const paymentStatus = {
  stage: "Processing",
  amount: "₹42,500",
};

export const liveQueue = {
  center: "Rampur Center",
  currentlyServing: 18,
  upcoming: [19, 20, 21],
  myToken: 23,
  fullQueue: [19, 20, 21, 22, 23],
  waitEstimateMin: 35,
  waitEstimateMax: 40,
};

export const notifications = [
  {
    id: 1,
    type: "success",
    text: "Your slot is confirmed for 25 May 2024, 10:30 AM",
  },
  {
    id: 2,
    type: "success",
    text: "Your token #23 will be served soon. Please reach the center.",
  },
  {
    id: 3,
    type: "payment",
    text: "Payment of ₹42,500 is processing.",
  },
];

export const howItWorks = [
  { id: 1, title: "Register", detail: "Create your profile" },
  { id: 2, title: "Book Slot", detail: "Choose date, time and crop" },
  { id: 3, title: "Get Token", detail: "Receive token and live updates" },
  { id: 4, title: "Visit Center", detail: "Visit at your scheduled time" },
  { id: 5, title: "Get Paid", detail: "Track status and receive payment" },
];

export const crops = [
  {
    id: 1,
    name: "Wheat",
    quantity: "20 Quintal",
    status: "Ready for Procurement",
    expectedDate: "25 May 2024",
    image: IMAGES.wheatField,
  },
  {
    id: 2,
    name: "Paddy",
    quantity: "18 Quintal",
    status: "Verified",
    expectedDate: "02 Jun 2024",
    image: IMAGES.paddyField,
  },
];

export const bookings = [
  {
    id: 1,
    date: "25 May 2024, 10:30 AM",
    crop: "Wheat",
    cropImage: IMAGES.wheatField,
    quantity: "20 Quintal",
    center: "Rampur Center",
    token: "#23",
    status: "Confirmed",
  },
  {
    id: 2,
    date: "20 May 2024, 09:00 AM",
    crop: "Paddy",
    cropImage: IMAGES.paddyField,
    quantity: "18 Quintal",
    center: "Rampur Center",
    token: "#19",
    status: "Completed",
  },
];

export const procurementCentre = {
  name: "Rampur Procurement Centre",
  status: "Open Today",
  hours: "8:00 AM – 6:00 PM",
  crowd: "Medium",
  currentToken: "#18",
  image: IMAGES.procurementCentreLarge,
};

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "crop-registration", label: "Crop Registration", icon: "ClipboardList" },
  { id: "my-tokens", label: "My Tokens", icon: "Ticket" },
  { id: "my-crops", label: "My Crops", icon: "Wheat" },
  { id: "procurement-status", label: "Procurement Status", icon: "ClipboardCheck" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "help-center", label: "Help Center", icon: "HelpCircle" },
  { id: "profile", label: "Profile", icon: "UserCircle" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "logout", label: "Logout", icon: "LogOut" },
];
