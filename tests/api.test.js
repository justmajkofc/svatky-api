const axios = require("axios");

const BASE_URL = "http://localhost:8000";

// Test cases for each endpoint
const testCases = [
  // Basic endpoints
  { path: "/", description: "API health check" },
  { path: "/api-docs", description: "Swagger documentation" },

  // Public holidays endpoints
  { path: "/api/public-holidays/cs", description: "Get all Czech holidays" },
  { path: "/api/public-holidays/cs/5", description: "Get Czech holidays for May" },
  { path: "/api/public-holidays/cs/5/8", description: "Get Czech holidays for May 8" },
  { path: "/api/public-holidays/search/den", description: "Search holidays by title" },
  { path: "/api/public-holidays/cs/stats", description: "Get Czech holiday statistics" },
  { path: "/api/public-holidays/cs/next", description: "Get next Czech holiday" },
  { path: "/api/public-holidays/cs/previous", description: "Get previous Czech holiday" },
  { path: "/api/public-holidays/cs/countdown/2024-03-19", description: "Get countdown to next holiday" },
  { path: "/api/public-holidays/overlap/2024-03-19", description: "Check holiday overlap" },

  // Name days endpoints
  { path: "/api/name-days/cs", description: "Get all Czech name days" },
  { path: "/api/name-days/cs/5", description: "Get Czech name days for May" },
  { path: "/api/name-days/cs/5/8", description: "Get Czech name days for May 8" },
  { path: "/api/name-days/cs/search/Jana", description: "Search Czech name days" },
  { path: "/api/name-days/cs/popular", description: "Get popular Czech name days" },

  // Calendar endpoints
  { path: "/api/calendar/cs/5", description: "Get calendar for May" },
  { path: "/api/day/cs/5/8", description: "Get info for May 8" },
  { path: "/api/day/cs/5/8/weekend", description: "Check if date is weekend" },
  { path: "/api/today", description: "Get today's info" },
  { path: "/api/tomorrow", description: "Get tomorrow's info" },

  // Utility endpoints
  { path: "/api/easter/2025", description: "Calculate Easter 2025" },
  { path: "/api/months/name/4", description: "Get month name for 4" },
  { path: "/api/months/number/august", description: "Get month number for august" },
  { path: "/api/date/validate/2024-03-19", description: "Validate date format" },
  { path: "/api/date/format/2024-03-19/DD.MM.YYYY", description: "Format date" }
];

async function runTests() {
  console.log("🚀 Starting API tests...\n");

  for (const test of testCases) {
    const url = `${BASE_URL}${test.path}`;
    try {
      const res = await axios.get(url);
      console.log(`✅ ${test.description}`);
      console.log(`  ${url} → ${res.status} ${res.statusText}\n`);
    } catch (err) {
      const status = err.response?.status || "ERR";
      const msg = err.response?.data?.error || err.message;
      console.log(`❌ ${test.description}`);
      console.log(`   ${url} → ${status} ${msg}\n`);
    }
  }

  console.log("✨ Tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 
