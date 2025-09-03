module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
      },
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        // keep other categories reasonable
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.8 }],
        // requested thresholds
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": [
          "warn",
          { maxNumericValue: 2500 },
        ],
        "total-byte-weight": ["warn", { maxNumericValue: 350000 }],
        // keep TBT/CLS reasonable
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
        "cumulative-layout-shift": [
          "error",
          { maxNumericValue: 0.1 },
        ],
        interactive: ["error", { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci-reports",
    },
  },
}
