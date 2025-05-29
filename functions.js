const data = require("./data.json");

function getAllHolidaysByCountry(countryCode) {
    const holidays = data.publicHolidays?.[countryCode];
    if (!holidays) return null;

    const result = [];
    for (const monthKey in holidays) {
        const month = holidays[monthKey];
        for (const holiday of month.holidays || []) {
            result.push({
                month: month.name,
                monthNumber: month.number,
                day: holiday.day,
                title: holiday.title,
                type: holiday.type
            });
        }
    }
    return result;
}

function getMonthKey(countryCode, input) {
    const monthNames = {
        1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
        7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"
    };

    // Handle numeric input directly
    if (typeof input === 'number' && monthNames[input]) {
        return monthNames[input];
    }

    // Handle string input
    const lower = String(input).toLowerCase();
    const num = parseInt(lower);

    if (!isNaN(num) && monthNames[num]) return monthNames[num];
    if (Object.values(monthNames).includes(lower)) return lower;
    return null;
}

function getHolidaysByMonth(countryCode, monthKey) {
    const holidays = data.publicHolidays?.[countryCode]?.[monthKey];
    if (!holidays) return null;

    return (holidays.holidays || []).map(h => ({
        month: holidays.name,
        monthNumber: holidays.number,
        day: h.day,
        title: h.title,
        type: h.type
    }));
}

function getHolidaysByDay(countryCode, monthKey, day) {
    const holidays = data.publicHolidays?.[countryCode]?.[monthKey];
    if (!holidays) return [];

    return (holidays.holidays || []).filter(h => h.day == day).map(h => ({
        month: holidays.name,
        monthNumber: holidays.number,
        day: h.day,
        title: h.title,
        type: h.type
    }));
}

function getHolidaysForDateAllCountries(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, month);
        if (monthKey) {
            const holidays = getHolidaysByDay(country, monthKey, day);
            result[country] = holidays || [];
        } else {
            result[country] = [];
        }
    }
    return result;
}

function getAllNameDaysByCountry(countryCode) {
    return data.nameDays?.[countryCode] || null;
}

function getNameDaysByMonth(countryCode, monthKey) {
    return data.nameDays?.[countryCode]?.[monthKey]?.days || null;
}

function getNameDay(countryCode, month, day) {
    const monthKey = getMonthKey(countryCode, month);
    if (!monthKey) return null;

    const days = data.nameDays?.[countryCode]?.[monthKey]?.days;
    if (!days) return null;

    const key = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
    return days[key] || null;
}

function getNameDaysForDateAllCountries(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, parseInt(month));
        if (monthKey) {
            // In data, name days are stored in format "DD/MM"
            const key = `${day}/${month}`;
            const name = data.nameDays?.[country]?.[monthKey]?.days?.[key];
            result[country] = name || "";
        } else {
            result[country] = "";
        }
    }
    return result;
}

function getMonthNameFromNumber(number) {
    const names = {
        1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
        7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"
    };
    return names[parseInt(number)] || null;
}

function getMonthNumberFromName(name) {
    const normalized = name.toLowerCase();
    const entries = {
        "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
        "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
    };
    return entries[normalized] || null;
}

function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function searchHolidayByTitle(title) {
    const result = {};
    for (const country of ["cs", "sk"]) {
        result[country] = [];
        for (const monthKey in data.publicHolidays?.[country] || {}) {
            const month = data.publicHolidays[country][monthKey];
            for (const holiday of month.holidays || []) {
                if (holiday.title.toLowerCase().includes(title.toLowerCase())) {
                    result[country].push({
                        month: month.name,
                        monthNumber: month.number,
                        day: holiday.day,
                        title: holiday.title,
                        type: holiday.type
                    });
                }
            }
        }
    }
    return result;
}

function searchNameDay(countryCode, name) {
    const result = [];
    const country = data.nameDays?.[countryCode];
    if (!country) return null;

    for (const monthKey in country) {
        const month = country[monthKey];
        for (const date in month.days) {
            if (month.days[date].toLowerCase().includes(name.toLowerCase())) {
                result.push({ date, name: month.days[date] });
            }
        }
    }
    return result;
}

function getHolidayStats(countryCode) {
    const holidays = getAllHolidaysByCountry(countryCode);
    if (!holidays) return null;

    const stats = {
        total: holidays.length,
        byMonth: {},
        byType: {}
    };

    for (const h of holidays) {
        stats.byMonth[h.month] = (stats.byMonth[h.month] || 0) + 1;
        stats.byType[h.type] = (stats.byType[h.type] || 0) + 1;
    }

    return stats;
}

// Přidáme novou funkci pro získání aktuálního data
function getCurrentDate() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
    };
}

// Přidáme novou funkci pro získání zítřejšího data
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
        year: tomorrow.getFullYear(),
        month: tomorrow.getMonth() + 1,
        day: tomorrow.getDate()
    };
}

function getTodayHolidays() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, month);
        if (monthKey) {
            const holidays = data.publicHolidays?.[country]?.[monthKey]?.holidays || [];
            result[country] = holidays.filter(h => h.day === day).map(h => ({
                title: h.title,
                type: h.type
            }));
        } else {
            result[country] = [];
        }
    }
    return result;
}

function getTomorrowHolidays() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = tomorrow.getDate();
    const month = tomorrow.getMonth() + 1;
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, month);
        if (monthKey) {
            const holidays = data.publicHolidays?.[country]?.[monthKey]?.holidays || [];
            result[country] = holidays.filter(h => h.day === day).map(h => ({
                title: h.title,
                type: h.type
            }));
        } else {
            result[country] = [];
        }
    }
    return result;
}

function getTodayNameDays() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, parseInt(month));
        if (monthKey) {
            const key = `${month}/${day}`;
            result[country] = data.nameDays?.[country]?.[monthKey]?.days?.[key] || "";
        } else {
            result[country] = "";
        }
    }
    return result;
}

function getTomorrowNameDays() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const result = {};

    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, parseInt(month));
        if (monthKey) {
            const key = `${month}/${day}`;
            result[country] = data.nameDays?.[country]?.[monthKey]?.days?.[key] || "";
        } else {
            result[country] = "";
        }
    }
    return result;
}

function getNextHoliday(countryCode) {
    const today = new Date();
    const holidays = getAllHolidaysByCountry(countryCode);
    if (!holidays) return null;

    const currentYear = today.getFullYear();
    const nextHolidays = holidays.map(h => ({
        ...h,
        date: new Date(currentYear, h.monthNumber - 1, h.day)
    })).filter(h => h.date >= today);

    if (nextHolidays.length === 0) {
        // If no holidays found this year, check next year
        const nextYearHolidays = holidays.map(h => ({
            ...h,
            date: new Date(currentYear + 1, h.monthNumber - 1, h.day)
        }));
        return nextYearHolidays[0];
    }

    return nextHolidays[0];
}

function getPreviousHoliday(countryCode) {
    const today = new Date();
    const holidays = getAllHolidaysByCountry(countryCode);
    if (!holidays) return null;

    const currentYear = today.getFullYear();
    const previousHolidays = holidays.map(h => ({
        ...h,
        date: new Date(currentYear, h.monthNumber - 1, h.day)
    })).filter(h => h.date < today);

    if (previousHolidays.length === 0) {
        // If no holidays found this year, check previous year
        const prevYearHolidays = holidays.map(h => ({
            ...h,
            date: new Date(currentYear - 1, h.monthNumber - 1, h.day)
        }));
        return prevYearHolidays[prevYearHolidays.length - 1];
    }

    return previousHolidays[previousHolidays.length - 1];
}

function getHolidayCountdown(countryCode, date) {
    const targetDate = new Date(date);
    const nextHoliday = getNextHoliday(countryCode);
    if (!nextHoliday) return null;

    const diffTime = nextHoliday.date - targetDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        days: diffDays,
        nextHoliday: {
            title: nextHoliday.title,
            date: nextHoliday.date.toISOString().split('T')[0]
        }
    };
}

function checkHolidayOverlap(date) {
    const targetDate = new Date(date);
    const result = {};
    
    for (const country of ["cs", "sk"]) {
        const monthKey = getMonthKey(country, targetDate.getMonth() + 1);
        if (monthKey) {
            const holidays = getHolidaysByDay(country, monthKey, targetDate.getDate());
            result[country] = holidays;
        } else {
            result[country] = [];
        }
    }
    
    return result;
}

function getPopularNameDays(countryCode) {
    const nameDays = getAllNameDaysByCountry(countryCode);
    if (!nameDays) return null;

    const nameCount = {};
    for (const month in nameDays) {
        const days = nameDays[month].days;
        for (const date in days) {
            const names = days[date].split(', ');
            names.forEach(name => {
                if (name) {
                    nameCount[name] = (nameCount[name] || 0) + 1;
                }
            });
        }
    }

    return Object.entries(nameCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
}

function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
}

function validateDate(date) {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}

function formatDate(date, format) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const formats = {
        'YYYY-MM-DD': () => d.toISOString().split('T')[0],
        'DD.MM.YYYY': () => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`,
        'DD/MM/YYYY': () => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
        'DD.MM.': () => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`
    };

    return formats[format] ? formats[format]() : null;
}

module.exports = {
    getAllHolidaysByCountry,
    getMonthKey,
    getHolidaysByMonth,
    getHolidaysByDay,
    getHolidaysForDateAllCountries,
    getAllNameDaysByCountry,
    getNameDaysByMonth,
    getNameDay,
    getNameDaysForDateAllCountries,
    getMonthNameFromNumber,
    getMonthNumberFromName,
    getEasterDate,
    searchHolidayByTitle,
    searchNameDay,
    getHolidayStats,
    getCurrentDate,
    getTomorrowDate,
    getTodayHolidays,
    getTomorrowHolidays,
    getTodayNameDays,
    getTomorrowNameDays,
    getNextHoliday,
    getPreviousHoliday,
    getHolidayCountdown,
    checkHolidayOverlap,
    getPopularNameDays,
    isWeekend,
    validateDate,
    formatDate
};
