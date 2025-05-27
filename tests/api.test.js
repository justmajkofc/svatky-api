  const axios = require("axios");

  // base url for our api
  const BASE_URL = "http://localhost:8000";

  // list of all endpoints we want to test
  const testCases = [
    // basic endpoints
    { path: "/", description: "Check if API is running" },
    { path: "/api-docs", description: "Check if docs are working" },

    // holiday endpoints
    { path: "/api/public-holidays/cs", description: "Get all Czech holidays" },
    { path: "/api/public-holidays/cs/5", description: "Get holidays in May" },
    { path: "/api/public-holidays/cs/5/8", description: "Get holiday on May 8" },
    { path: "/api/public-holidays/search/den", description: "Search holidays" },
    { path: "/api/public-holidays/cs/stats", description: "Get holiday stats" },

    // name day endpoints
    { path: "/api/name-days/cs", description: "Get all name days" },
    { path: "/api/name-days/cs/5", description: "Get name days in May" },
    { path: "/api/name-days/cs/5/8", description: "Get name day on May 8" },
    { path: "/api/name-days/cs/search/Jana", description: "Search for Jana" },

    // calendar endpoints
    { path: "/api/calendar/cs/5", description: "Get May calendar" },
    { path: "/api/day/cs/5/8", description: "Get info for May 8" },
    { path: "/api/today", description: "Get today info" },
    { path: "/api/tomorrow", description: "Get tomorrow info" },

    // other endpoints
    { path: "/api/easter/2025", description: "Get Easter 2025" },
    { path: "/api/months/name/4", description: "Get month name" },
    { path: "/api/months/number/august", description: "Get month number" }
  ];

  // main function to run all tests
  async function runTests() {
    console.log("Starting API tests...\n");

    // loop through all test cases
    for (const test of testCases) {
      const url = BASE_URL + test.path;
      
      try {
        // try to get response from endpoint
        const res = await axios.get(url);
        console.log("✅ " + test.description);
        console.log("   " + url + " -> " + res.status + "\n");
      } catch (err) {
        // if there is error, show it
        console.log("❌ " + test.description);
        if (err.response) {
          console.log("   " + url + " -> " + err.response.status + " " + err.response.statusText + "\n");
        } else {
          console.log("   " + url + " -> Error: " + err.message + "\n");
        }
      }
    }

    console.log("Tests finished!");
  }

  // run tests if this file is run directly
  if (require.main === module) {
    runTests().catch(err => {
      console.error("Error running tests:", err);
    });
  }

  // export for other files to use
  module.exports = { runTests };
