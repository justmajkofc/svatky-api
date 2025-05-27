# Holiday & Name Day API / API pro svátky a jmeniny

[English](#english) | [Čeština](#czech)

<a id="english"></a>
# English Documentation

A RESTful API service that provides information about public holidays and name days in the Czech and Slovak Republics.

## Features

- Public holidays information for Czech Republic (cs) and Slovakia (sk)
- Name days for both countries
- Easter date calculation
- Month name/number conversion
- Search functionality for holidays and name days
- Statistics for holidays by country
- Today and tomorrow information
- Calendar view by month

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `config.json` file with your port configuration:
```json
{
  "port": 8000
}
```

4. Start the server:
```bash
node server.js
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

### Endpoints Reference

| Endpoint | Method | Description | Example Response |
|----------|--------|-------------|------------------|
| `/api/public-holidays/{country}` | GET | Get all holidays for a country | `[{"month":"January","monthNumber":1,"day":1,"title":"New Year","type":"holidays"}]` |
| `/api/public-holidays/{country}/{month}` | GET | Get holidays for a month | `[{"month":"May","monthNumber":5,"day":1,"title":"Labor Day","type":"holidays"}]` |
| `/api/public-holidays/{country}/{month}/{day}` | GET | Get holidays for a date | `[{"month":"May","monthNumber":5,"day":8,"title":"Victory Day","type":"holidays"}]` |
| `/api/public-holidays/search/{title}` | GET | Search holidays by title | `{"cs":[{"month":"May","monthNumber":5,"day":1,"title":"Labor Day","type":"holidays"}]}` |
| `/api/public-holidays/{country}/stats` | GET | Get holiday statistics | `{"total":13,"byMonth":{"May":2},"byType":{"holidays":10}}` |
| `/api/name-days/{country}` | GET | Get all name days | `{"january":{"name":"January","number":1,"days":{"01/01":""}}}` |
| `/api/name-days/{country}/{month}` | GET | Get name days for a month | `{"01/01":"","02/01":"Karina"}` |
| `/api/name-days/{country}/{month}/{day}` | GET | Get name day for a date | `{"name":"Karina"}` |
| `/api/name-days/{country}/search/{name}` | GET | Search name days by name | `[{"date":"02/01","name":"Karina"}]` |
| `/api/calendar/{country}/{month}` | GET | Get calendar info for month | `{"holidays":[...],"nameDays":{...}}` |
| `/api/day/{country}/{month}/{day}` | GET | Get info for specific day | `{"holidays":[...],"name":"Karina"}` |
| `/api/today` | GET | Get today's info | `{"date":"2024-03-20","holidays":{...},"nameDays":{...}}` |
| `/api/tomorrow` | GET | Get tomorrow's info | `{"date":"2024-03-21","holidays":{...},"nameDays":{...}}` |
| `/api/easter/{year}` | GET | Calculate Easter date | `{"date":"2024-03-31"}` |
| `/api/months/name/{number}` | GET | Get month name from number | `{"name":"january"}` |
| `/api/months/number/{name}` | GET | Get month number from name | `{"number":1}` |

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful request
- 400: Invalid input parameters
- 404: Resource not found
- 500: Internal server error

## Data Source

This API uses data from the [czech-slovak-holidays](https://github.com/justmajkofc/czech-slovak-holidays) dataset, which I created and maintain.

## License

This project is open source and available under the MIT License.

## Testing

The project includes a test file (`tests/api.test.js`) that can be used to verify all API endpoints. To run the tests:

```bash
node tests/api.test.js
```

The test file checks all available endpoints and provides a clear output of their status.

---

<a id="czech"></a>
# Česká Dokumentace

RESTful API služba poskytující informace o státních svátcích a jmeninách v České a Slovenské republice.

## Funkce

- Informace o státních svátcích pro Českou republiku (cs) a Slovensko (sk)
- Jmeniny pro obě země
- Výpočet data Velikonoc
- Převod názvů měsíců na čísla a naopak
- Vyhledávání svátků a jmenin
- Statistiky svátků podle země
- Informace o dnešním a zítřejším dni
- Kalendářní zobrazení podle měsíce

## Instalace

1. Naklonujte repozitář
2. Nainstalujte závislosti:
```bash
npm install
```

3. Vytvořte soubor `config.json` s konfigurací portu:
```json
{
  "port": 8000
}
```

4. Spusťte server:
```bash
node server.js
```

## API Dokumentace

API dokumentace je dostupná na `/api-docs` když je server spuštěný.

### Reference Endpointů

| Endpoint | Metoda | Popis | Příklad odpovědi |
|----------|--------|-------|------------------|
| `/api/public-holidays/{country}` | GET | Získat všechny svátky pro zemi | `[{"month":"Leden","monthNumber":1,"day":1,"title":"Nový rok","type":"holidays"}]` |
| `/api/public-holidays/{country}/{month}` | GET | Získat svátky pro měsíc | `[{"month":"Květen","monthNumber":5,"day":1,"title":"Svátek práce","type":"holidays"}]` |
| `/api/public-holidays/{country}/{month}/{day}` | GET | Získat svátky pro datum | `[{"month":"Květen","monthNumber":5,"day":8,"title":"Den vítězství","type":"holidays"}]` |
| `/api/public-holidays/search/{title}` | GET | Vyhledat svátky podle názvu | `{"cs":[{"month":"Květen","monthNumber":5,"day":1,"title":"Svátek práce","type":"holidays"}]}` |
| `/api/public-holidays/{country}/stats` | GET | Získat statistiky svátků | `{"total":13,"byMonth":{"Květen":2},"byType":{"holidays":10}}` |
| `/api/name-days/{country}` | GET | Získat všechny jmeniny | `{"january":{"name":"Leden","number":1,"days":{"01/01":""}}}` |
| `/api/name-days/{country}/{month}` | GET | Získat jmeniny pro měsíc | `{"01/01":"","02/01":"Karina"}` |
| `/api/name-days/{country}/{month}/{day}` | GET | Získat jmeniny pro datum | `{"name":"Karina"}` |
| `/api/name-days/{country}/search/{name}` | GET | Vyhledat jmeniny podle jména | `[{"date":"02/01","name":"Karina"}]` |
| `/api/calendar/{country}/{month}` | GET | Získat kalendářní info pro měsíc | `{"holidays":[...],"nameDays":{...}}` |
| `/api/day/{country}/{month}/{day}` | GET | Získat info pro konkrétní den | `{"holidays":[...],"name":"Karina"}` |
| `/api/today` | GET | Získat info o dnešním dni | `{"date":"2024-03-20","holidays":{...},"nameDays":{...}}` |
| `/api/tomorrow` | GET | Získat info o zítřejším dni | `{"date":"2024-03-21","holidays":{...},"nameDays":{...}}` |
| `/api/easter/{year}` | GET | Vypočítat datum Velikonoc | `{"date":"2024-03-31"}` |
| `/api/months/name/{number}` | GET | Získat název měsíce z čísla | `{"name":"january"}` |
| `/api/months/number/{name}` | GET | Získat číslo měsíce z názvu | `{"number":1}` |

## Zpracování chyb

API vrací příslušné HTTP stavové kódy:
- 200: Úspěšný požadavek
- 400: Neplatné vstupní parametry
- 404: Zdroje nenalezeny
- 500: Interní chyba serveru

## Zdroj dat

Toto API používá data z datasetu [czech-slovak-holidays](https://github.com/justmajkofc/czech-slovak-holidays), jehož jsem autorem a správcem.

## Licence

Tento projekt je open source a je dostupný pod licencí MIT.

## Testování

Projekt obsahuje testovací soubor (`tests/api.test.js`), který lze použít k ověření všech API endpointů. Pro spuštění testů:

```bash
node tests/api.test.js
```

Testovací soubor kontroluje všechny dostupné endpointy a poskytuje přehledný výstup jejich stavu. 
