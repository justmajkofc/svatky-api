const data = require("./data.json");

// get all holidays for a country
function getAllHolidaysByCountry(code) {
    // check if country exists
    if (!data.publicHolidays || !data.publicHolidays[code]) {
        return null;
    }

    let holidaysList = [];

    // loop through all months
    for (let month in data.publicHolidays[code]) {
        let monthData = data.publicHolidays[code][month];

        // check if month has holidays
        if (monthData.holidays) {
            // add each holiday to list
            for (let i = 0; i < monthData.holidays.length; i++) {
                let h = monthData.holidays[i];
                holidaysList.push({
                    month: monthData.name,
                    monthNumber: monthData.number,
                    day: h.day,
                    title: h.title,
                    type: h.type
                });
            }
        }
    }

    return holidaysList;
}

// convert month input to month key
function getMonthKey(code, monthInput) {
    // map of month numbers to names
    let months = {
        1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
        7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"
    };

    // if input is number, return month name
    if (typeof monthInput === "number") {
        return months[monthInput];
    }

    // convert input to lowercase
    let inputStr = String(monthInput).toLowerCase();
    let inputNum = parseInt(inputStr);

    // if input is number string, return month name
    if (!isNaN(inputNum)) {
        return months[inputNum];
    }

    // check if input matches any month name
    for (let key in months) {
        if (months[key] === inputStr) {
            return inputStr;
        }
    }

    return null;
}

// get holidays for a month
function getHolidaysByMonth(code, monthKey) {
    // check if data exists
    if (!data.publicHolidays || !data.publicHolidays[code] || !data.publicHolidays[code][monthKey]) {
        return null;
    }

    let month = data.publicHolidays[code][monthKey];
    let list = [];

    // add holidays to list
    if (month.holidays) {
        for (let h of month.holidays) {
            list.push({
                month: month.name,
                monthNumber: month.number,
                day: h.day,
                title: h.title,
                type: h.type
            });
        }
    }

    return list;
}

// get holidays for a specific day
function getHolidaysByDay(code, monthKey, day) {
    // check if data exists
    if (!data.publicHolidays || !data.publicHolidays[code] || !data.publicHolidays[code][monthKey]) {
        return [];
    }

    let result = [];
    let month = data.publicHolidays[code][monthKey];

    // find holidays for the day
    if (month.holidays) {
        for (let h of month.holidays) {
            if (h.day == day) {
                result.push({
                    month: month.name,
                    monthNumber: month.number,
                    day: h.day,
                    title: h.title,
                    type: h.type
                });
            }
        }
    }

    return result;
}

// get holidays for today in all countries
function getHolidaysForDateAllCountries(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let monthKey = getMonthKey("cs", month);
    let result = {};
    let countries = ["cs", "sk"];

    // get holidays for each country
    for (let i = 0; i < countries.length; i++) {
        let c = countries[i];
        result[c] = getHolidaysByDay(c, monthKey, day);
    }

    return result;
}

// get all name days for a country
function getAllNameDaysByCountry(code) {
    if (!data.nameDays || !data.nameDays[code]) return null;
    return data.nameDays[code];
}

// get name days for a month
function getNameDaysByMonth(code, monthKey) {
    if (!data.nameDays || !data.nameDays[code] || !data.nameDays[code][monthKey]) {
        return null;
    }

    return data.nameDays[code][monthKey].days;
}

// get name day for a specific date
function getNameDay(code, month, day) {
    let monthKey = getMonthKey(code, month);
    if (!monthKey) return null;

    // format day and month with leading zeros
    let dayStr = String(day).padStart(2, "0");
    let monthStr = String(month).padStart(2, "0");

    // get name day from data
    if (data.nameDays && data.nameDays[code] && data.nameDays[code][monthKey]) {
        return data.nameDays[code][monthKey].days?.[`${dayStr}/${monthStr}`] || null;
    }

    return null;
}

// get name days for today in all countries
function getNameDaysForDateAllCountries(date) {
    let d = String(date.getDate()).padStart(2, "0");
    let m = String(date.getMonth() + 1).padStart(2, "0");
    let result = {};

    // get name days for each country
    for (let c of ["cs", "sk"]) {
        let monthKey = getMonthKey(c, parseInt(m));
        if (monthKey) {
            let name = data.nameDays?.[c]?.[monthKey]?.days?.[`${d}/${m}`];
            result[c] = name || "";
        } else {
            result[c] = "";
        }
    }

    return result;
}

// get month name from number
function getMonthNameFromNumber(n) {
    let map = {
        1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
        7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"
    };

    return map[parseInt(n)] || null;
}

// get month number from name
function getMonthNumberFromName(name) {
    let lower = name.toLowerCase();
    let lookup = {
        "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
        "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
    };

    return lookup[lower] || null;
}

// calculate easter date for a year
function getEasterDate(year) {
    // easter calculation algorithm
    let a = year % 19;
    let b = Math.floor(year / 100);
    let c = year % 100;
    let d = Math.floor(b / 4);
    let e = b % 4;
    let f = Math.floor((b + 8) / 25);
    let g = Math.floor((b - f + 1) / 3);
    let h = (19 * a + b - d - g + 15) % 30;
    let i = Math.floor(c / 4);
    let k = c % 4;
    let l = (32 + 2 * e + 2 * i - h - k) % 7;
    let m = Math.floor((a + 11 * h + 22 * l) / 451);
    let month = Math.floor((h + l - 7 * m + 114) / 31);
    let day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}

// search holidays by title
function searchHolidayByTitle(title) {
    let result = {
        cs: [],
        sk: []
    };

    // search in each country
    for (let c of ["cs", "sk"]) {
        let months = data.publicHolidays?.[c];
        if (months) {
            // search in each month
            for (let m in months) {
                let month = months[m];
                for (let h of month.holidays || []) {
                    // check if title matches
                    if (h.title.toLowerCase().includes(title.toLowerCase())) {
                        result[c].push({
                            month: month.name,
                            monthNumber: month.number,
                            day: h.day,
                            title: h.title,
                            type: h.type
                        });
                    }
                }
            }
        }
    }

    return result;
}

// search name days by name
function searchNameDay(code, name) {
    let results = [];
    let country = data.nameDays?.[code];
    if (!country) return null;

    // search in each month
    for (let m in country) {
        let month = country[m];
        for (let date in month.days) {
            let value = month.days[date];
            // check if name matches
            if (value.toLowerCase().includes(name.toLowerCase())) {
                results.push({
                    date: date,
                    name: value
                });
            }
        }
    }

    return results;
}

// get holiday statistics for a country
function getHolidayStats(code) {
    let list = getAllHolidaysByCountry(code);
    if (!list) return null;

    let stats = {
        total: list.length,
        byMonth: {},
        byType: {}
    };

    // count holidays by month and type
    for (let h of list) {
        if (!stats.byMonth[h.month]) {
            stats.byMonth[h.month] = 0;
        }
        stats.byMonth[h.month]++;

        if (!stats.byType[h.type]) {
            stats.byType[h.type] = 0;
        }
        stats.byType[h.type]++;
    }

    return stats;
}

// export all functions
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
    getHolidayStats
};
