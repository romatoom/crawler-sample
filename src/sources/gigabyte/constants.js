import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "GIGABYTE",

  ORIGINAL_NAME: "gigabyte",
  BASE_URL: "https://www.gigabyte.com",
  BRAND: "Gigabyte",

  LABELS: {
    CATEGORIES: "CATEGORIES",
    PRODUCT: "PRODUCT",

    ENTERPRISE_CATEGORIES: "ENTERPRISE_CATEGORIES",
    ENTERPRISE_PRODUCT: "ENTERPRISE_PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  CONSUMER_CATEGORIES: {
    Motherboards: "/Motherboard/All-Series",
    "Graphics Cards": "/Graphics-Card/All-Series",
    Laptops: "/Laptop/All-Series",
    Monitors: "/Monitor/All-Series",
    "Gaming PCs": "/Gaming-PC",
    "BRIX (Mini-PCs Barebone)": "/Mini-PcBarebone",
    Mouses: "/Mouse",
    Headsets: "/Headset",
    "Gaming Chairs": "/Gaming-Chair",
    Keyboard: "/Keyboard",
    "PC Cases": "/PC-Case",
    "Power Supplies": "/Power-Supply",
    "CPU Coolers": "/CPU-Cooler",
    SSDs: "/SSD",
    Memory: "/Memory",
    "DIY KIT": "/DIY-KIT",
  },

  ENTERPRISE_CATEGORIES: {
    "Server Motherboards": "/Enterprise/Server-Motherboard",
    "Rack Servers": "/Enterprise/Rack-Server",
    "High Density Servers": "/Enterprise/High-Density-Server",
    "Advanced Cooling": "/Enterprise/Advanced-Cooling",
    "Data Centers": "/Enterprise/Data-Center",
    "Workstation Motherboards": "/Enterprise/Workstation-Motherboard",
    "GPU Servers": "/Enterprise/GPU-Server",
    "Tower Servers": "/Enterprise/Tower-Server",
    Accessory: "/Enterprise/Accessory",
    "x86 Servers": "/Enterprise/x86-Server",
    "ARM Servers": "/Enterprise/ARM-Server",
    Servers: "/Enterprise/Server",
    "Storage Servers": "/Enterprise/Storage-Server",
    "Embedded Computing": "/Enterprise/Embedded-Computing",
    "e-Mobility": "/Enterprise/e-Mobility",
  },

  MANUALS_TYPES: ["User Guide", "User Manual", "Installation Guide"],
};

export default SOURCE;
