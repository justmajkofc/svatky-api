const express = require("express");
const app = express();
const config = require("./config.json");
const functions = require("./functions.js");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());
app.set("json spaces", 3);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Holiday & Name Day API",
      version: "1.0.0",
      description: "API for public holidays and name days in Czech and Slovak Republics",
    },
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check if API is working
 *     responses:
 *       200:
 *         description: API is working
 */
app.get("/", (req, res) => {
  res.json("API is working");
});

// --- PRIORITIZED ROUTES to avoid route collision ---

/**
 * @swagger
 * /api/public-holidays/search/{title}:
 *   get:
 *     summary: Search holidays by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Title to search for
 *     responses:
 *       200:
 *         description: Matching holidays by country
 */
app.get("/api/public-holidays/search/:title", (req, res) => {
  const result = functions.searchHolidayByTitle(req.params.title);
  res.json(result);
});

/**
 * @swagger
 * /api/public-holidays/{country}/stats:
 *   get:
 *     summary: Get holiday statistics for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *     responses:
 *       200:
 *         description: Holiday statistics
 *       404:
 *         description: Country not found
 */
app.get("/api/public-holidays/:country/stats", (req, res) => {
  const stats = functions.getHolidayStats(req.params.country);
  if (!stats) return res.status(404).json({ error: "Country not found" });
  res.json(stats);
});

/**
 * @swagger
 * /api/name-days/{country}/search/{name}:
 *   get:
 *     summary: Search name days by name
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name to search for
 *     responses:
 *       200:
 *         description: Matching name days
 *       404:
 *         description: No name day found
 */
app.get("/api/name-days/:country/search/:name", (req, res) => {
  const result = functions.searchNameDay(req.params.country, req.params.name);
  if (!result || result.length === 0) return res.status(404).json({ error: "No name day found" });
  res.json(result);
});

/**
 * @swagger
 * /api/public-holidays/{country}:
 *   get:
 *     summary: Get all public holidays for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *     responses:
 *       200:
 *         description: All holidays for the country
 *       404:
 *         description: Country not found
 */
app.get("/api/public-holidays/:country", (req, res) => {
  const { country } = req.params;
  const holidays = functions.getAllHolidaysByCountry(country);
  if (!holidays) return res.status(404).json({ error: "Country not found" });
  res.json(holidays);
});

/**
 * @swagger
 * /api/public-holidays/{country}/{month}:
 *   get:
 *     summary: Get holidays for a specific month
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *     responses:
 *       200:
 *         description: Holidays for the month
 *       400:
 *         description: Invalid month
 *       404:
 *         description: No holidays found
 */
app.get("/api/public-holidays/:country/:month", (req, res) => {
  const { country, month } = req.params;
  const monthKey = functions.getMonthKey(country, month);
  if (!monthKey) return res.status(400).json({ error: "Invalid month" });

  const holidays = functions.getHolidaysByMonth(country, monthKey);
  if (!holidays) return res.status(404).json({ error: "No holidays found" });
  res.json(holidays);
});

/**
 * @swagger
 * /api/public-holidays/{country}/{month}/{day}:
 *   get:
 *     summary: Get holidays for a specific date
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *         description: Day of the month
 *     responses:
 *       200:
 *         description: Holidays for the date
 *       400:
 *         description: Invalid month
 *       404:
 *         description: No holidays on this day
 */
app.get("/api/public-holidays/:country/:month/:day", (req, res) => {
  const { country, month, day } = req.params;
  const monthKey = functions.getMonthKey(country, month);
  if (!monthKey) return res.status(400).json({ error: "Invalid month" });

  const holidays = functions.getHolidaysByDay(country, monthKey, day);
  if (!holidays.length) return res.status(404).json({ error: "No holidays on this day" });
  res.json(holidays);
});

/**
 * @swagger
 * /api/name-days/{country}:
 *   get:
 *     summary: Get all name days for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *     responses:
 *       200:
 *         description: All name days for the country
 *       404:
 *         description: Country not found
 */
app.get("/api/name-days/:country", (req, res) => {
  const { country } = req.params;
  const days = functions.getAllNameDaysByCountry(country);
  if (!days) return res.status(404).json({ error: "Country not found" });
  res.json(days);
});

/**
 * @swagger
 * /api/name-days/{country}/{month}:
 *   get:
 *     summary: Get name days for a specific month
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *     responses:
 *       200:
 *         description: Name days for the month
 *       400:
 *         description: Invalid month
 *       404:
 *         description: No name days found
 */
app.get("/api/name-days/:country/:month", (req, res) => {
  const { country, month } = req.params;
  const monthKey = functions.getMonthKey(country, month);
  if (!monthKey) return res.status(400).json({ error: "Invalid month" });

  const names = functions.getNameDaysByMonth(country, monthKey);
  if (!names) return res.status(404).json({ error: "No name days found" });
  res.json(names);
});

/**
 * @swagger
 * /api/name-days/{country}/{month}/{day}:
 *   get:
 *     summary: Get name day for a specific date
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *         description: Day of the month
 *     responses:
 *       200:
 *         description: Name day information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name day for the specified date
 */
app.get("/api/name-days/:country/:month/:day", (req, res) => {
  const { country, month, day } = req.params;
  const name = functions.getNameDay(country, month, day);
  res.json({ name: name || "" });
});

/**
 * @swagger
 * /api/calendar/{country}/{month}:
 *   get:
 *     summary: Get calendar information for a month
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *     responses:
 *       200:
 *         description: Calendar information including holidays and name days
 *       400:
 *         description: Invalid month
 */
app.get("/api/calendar/:country/:month", (req, res) => {
  const { country, month } = req.params;
  const monthKey = functions.getMonthKey(country, month);
  if (!monthKey) return res.status(400).json({ error: "Invalid month" });

  const holidays = functions.getHolidaysByMonth(country, monthKey);
  const nameDays = functions.getNameDaysByMonth(country, monthKey);
  res.json({ holidays, nameDays });
});

/**
 * @swagger
 * /api/day/{country}/{month}/{day}:
 *   get:
 *     summary: Get information for a specific day
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (cs/sk)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number or name
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *         description: Day of the month
 *     responses:
 *       200:
 *         description: Day information including holidays and name day
 *       400:
 *         description: Invalid month
 */
app.get("/api/day/:country/:month/:day", (req, res) => {
  const { country, month, day } = req.params;
  const monthKey = functions.getMonthKey(country, month);
  if (!monthKey) return res.status(400).json({ error: "Invalid month" });

  const holidays = functions.getHolidaysByDay(country, monthKey, day);
  const name = functions.getNameDay(country, month, day);
  res.json({ holidays, name });
});

/**
 * @swagger
 * /api/easter/{year}:
 *   get:
 *     summary: Calculate Easter date for a year
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year to calculate Easter for
 *     responses:
 *       200:
 *         description: Easter date
 *       400:
 *         description: Invalid year
 */
app.get("/api/easter/:year", (req, res) => {
  const year = parseInt(req.params.year);
  if (isNaN(year)) return res.status(400).json({ error: "Invalid year" });

  const date = functions.getEasterDate(year);
  res.json({ date: date.toISOString().split("T")[0] });
});

/**
 * @swagger
 * /api/months/name/{number}:
 *   get:
 *     summary: Get month name from number
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: string
 *         description: Month number (1-12)
 *     responses:
 *       200:
 *         description: Month name
 *       400:
 *         description: Invalid number
 */
app.get("/api/months/name/:number", (req, res) => {
  const name = functions.getMonthNameFromNumber(req.params.number);
  if (!name) return res.status(400).json({ error: "Invalid number" });
  res.json({ name });
});

/**
 * @swagger
 * /api/months/number/{name}:
 *   get:
 *     summary: Get month number from name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Month name
 *     responses:
 *       200:
 *         description: Month number
 *       400:
 *         description: Invalid name
 */
app.get("/api/months/number/:name", (req, res) => {
  const number = functions.getMonthNumberFromName(req.params.name);
  if (!number) return res.status(400).json({ error: "Invalid name" });
  res.json({ number });
});

/**
 * @swagger
 * /api/today:
 *   get:
 *     summary: Get holidays and name days for today
 *     responses:
 *       200:
 *         description: Today's information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Today's date in YYYY-MM-DD format
 *                 holidays:
 *                   type: object
 *                   description: Holidays for today by country
 *                 nameDays:
 *                   type: object
 *                   description: Name days for today by country
 *       500:
 *         description: Internal server error
 */
app.get("/api/today", (req, res) => {
  try {
    const date = new Date();
    const holidays = functions.getHolidaysForDateAllCountries(date);
    const nameDays = functions.getNameDaysForDateAllCountries(date);
    res.json({ 
      date: date.toISOString().split('T')[0],
      holidays, 
      nameDays 
    });
  } catch (error) {
    console.error("Error in /api/today:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/tomorrow:
 *   get:
 *     summary: Get holidays and name days for tomorrow
 *     responses:
 *       200:
 *         description: Tomorrow's information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Tomorrow's date in YYYY-MM-DD format
 *                 holidays:
 *                   type: object
 *                   description: Holidays for tomorrow by country
 *                 nameDays:
 *                   type: object
 *                   description: Name days for tomorrow by country
 *       500:
 *         description: Internal server error
 */
app.get("/api/tomorrow", (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const holidays = functions.getHolidaysForDateAllCountries(date);
    const nameDays = functions.getNameDaysForDateAllCountries(date);
    res.json({ 
      date: date.toISOString().split('T')[0],
      holidays, 
      nameDays 
    });
  } catch (error) {
    console.error("Error in /api/tomorrow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(config.port, () => {
  console.log(`✅ Server running at http://localhost:${config.port}`);
  console.log(`📚 Swagger docs at http://localhost:${config.port}/api-docs`);
});