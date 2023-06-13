export function normalizeTitle(title) {
  let normalizedTitle = title.trim().toLowerCase();
  return normalizedTitle.charAt(0).toUpperCase() + normalizedTitle.slice(1);
}

export const MI_FORMATTERS = {
  cleanedManualTitle: (title) => {
    let regexp =
      /Generic User Guide for|Generic User Guide|General User Guide|User Guide|Safety Information|Quick Start Guide|Adapter Information|\(M2110E1\)|\(M2133E1\)/;

    let cleanedTitle = title.replace(regexp, "").trim();
    regexp = /\(3.5L\)/;
    return cleanedTitle.replace(regexp, "3.5L");
  },

  materialTypeByManualTitle: (title) => {
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
  },
};

export const CENTRAL_MANUALS_FORMATTERS = {
  infoByManualTitle: (title) => {
    const MANUAL_TYPE_MAX_LENGTH = 60;

    const manualTitleParts = title.split(" - ").map((el) => el.trim());
    const brand = manualTitleParts[0].trim();
    let manualType = manualTitleParts[manualTitleParts.length - 1].trim();

    manualType = manualType.replace("’", "'");
    manualType = manualType.replace("U.M.", "User Manual");

    if (manualType.length >= MANUAL_TYPE_MAX_LENGTH) manualType = "Manual";

    const productName = manualTitleParts
      .slice(1, manualTitleParts.length - 1)
      .join(" - ")
      .trim();

    return { productName, manualType, brand };

    // System Administrator’s Guide
    // Administrator's Guide
    // Administrator’s Guide
    // Administrator Guide
    // Administration Guide
    // System Administrator Guide
    // IT Administrator's Guide
    // Quick Reference Card
    // Quick Reference Manual
    // Reference Manual
    // Client Guide
    // Installation Poster
    // Installation Guide & Operating Instructions
    // Quick Installation Guide
    // Command-Line Reference
    // Evaluation Guide
    // Upgrade Guide
    // Upgrade Manual
    // Upgrading Guide
    // Installation and Upgrade Guide
    // Installation Manual
    // Installation and Setup Guide
    // Installation and U.M.
    // Install Guide
    // Start Guide
    // Detailed User Guide
    // Extended User Guide
    // Quick Reference Guide
    // Quick Reference
    // Reference Guide
    // Help and Tutorials
    // Help
    // Help Guide
    // Troubleshooting
    // Integration Guide
    // Developer’s Guide
    // Developer Guide
    // Development Guide
    // Programming Guide
    // Migration Guide
    // Reviewer’s Guide
    // Reviewer's Guide
    // Workflow Guide
    // Product Manual
    // Repair Manual
    // Repair Guide
    // Information Manual
    // Setup Guide
    // Quick Setup Guide
    // Service Manual, Parts List, Diagrams and Assembling Charts
    // Parts List, Diagrams and Assembling Charts
    // Repair Manual, Parts List, Diagrams and Assembling Charts
    // Repair Guide, Parts List, Diagrams and Assembling Charts
    // Service Manual
    // Handbook
    // Guidebook
    // Starting Guide
    // Maintenance Manual
    // Maintenance and Service Guide
    // Shortcut Guide
    // Preview Guide
    // Customization Guide
    // Tutorial
    // Setup and Configuration Guide
    // Setup and Configuration Manual
    // Configuration Guide
    // Software Installation and Configuration Guide
    // Software Manual
    // Hardware and Software Manua
    // Best Practices Guide
    // Failover Guide
    // Setup and U.M.
    // Setup and User's Guide
    // Installation & U.M.
    // Setup and Maintenance Guide
    // Performance and Redistribution Guide
    // Installation
    // Basics Guide
    // Tips
    // Start Here
    // Learn More
    // Hardware Manual
    // Security Guide
    // Startup Guide
    // Deployment Guide
    // Basic Operating Instructions
    // Hardware Maintenance
    // Safety, Warranty and Quick Start Guide
    // Safety, Warranty & Quick Start Guide

    // !!! Sphere Installation\nand Configuration Guide

    // * Programmer’s Guide
    // * Reference *
    // * Quick Start Guide *
    // * Installation Guide
    // Quick Start *
    //  * Quick Guide
    // * User Manual *
    // * User Guide
    // * Technical Support Manual
    // * Installation and Configuration
    // * Product Information
    // * Instructions
    // * Basic Setup Guide
    // * Guide
    // * Installation

    // !!! yarvik   Run - PMP-025 - IU.M.
  },

  joinTitles: (titles) => {
    const productNames = [
      ...new Set(
        titles.map((title) => {
          const { productName } =
            CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(title);
          return productName;
        })
      ),
    ];

    const { brand, manualType } = CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(
      titles[0]
    );

    return `${brand} - ${productNames.join(" / ")} - ${manualType}`;
  },
};
