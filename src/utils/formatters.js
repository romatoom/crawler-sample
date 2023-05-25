export function normalizeTitle(title) {
  let normalizedTitle = title.trim().toLowerCase();
  return normalizedTitle.charAt(0).toUpperCase() + normalizedTitle.slice(1);
}

export function cleanedManualTitle(title) {
  let regexp =
    /Generic User Guide for|Generic User Guide|General User Guide|User Guide|Safety Information|Quick Start Guide|Adapter Information|\(M2110E1\)|\(M2133E1\)/;

  // Mi Smart Air Fryer (3.5L) -> Mi Smart Air Fryer 3.5L
  // Redmi Buds 3 Lite
  let cleanedTitle = title.replace(regexp, "").trim();
  regexp = /\(3.5L\)/;
  return cleanedTitle.replace(regexp, "3.5L");
}

export function materialTypeByManualTitle(title) {
  let result = title.trim().toLowerCase();

  if (
    result.includes("generic user guide") ||
    result.includes("general user guide") ||
    result.includes("genel kullanım kılavuzu") ||
    result.includes("genel kullanıcı kılavuzu")
  ) {
    return "General User Guide";
  }

  if (result.includes("quick start guide")) {
    return "Quick Start Guide";
  }

  if (result.includes("user guide")) {
    return "User Guide";
  }

  if (
    result.includes("safety information") ||
    result.includes("güvenlik bilgileri")
  ) {
    return "Safety Information";
  }

  return "Manual";

  /*
  Generic User Guide for MIUI 13
  Generic User Guide for MIUI 14

  Xiaomi Phone Generic User Guide

  Safety Information

  Redmi Note 10 5G Safety Information

  GUID-507C72B3-D51B-4AC6-B42C-DAE33C68C5E5
  Xiaomi Pad 5

  Xiaomi 12T Quick Start Guide

  Xiaomi Telefon Genel Kullanım Kılavuzu - Xiaomi Phone General User Guide
  Adaptör Bilgileri - Adapter Information
  Güvenlik Bilgileri - Safety Information
  MIUI 14 için Genel Kullanıcı Kılavuzu - General User Guide for MIUI 14
  */
}
