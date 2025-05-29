# 🎉 Holiday & Name Day API

[English](#english) | [Čeština](#czech)

<a id="english"></a>
# English

REST API for retrieving information about public holidays and name days in the Czech and Slovak Republic.

## 🌟 Features

- Public holidays for CZ and SK
- Name days for CZ and SK
- Today and tomorrow information
- Holiday and name day search
- Holiday statistics
- Easter date calculation
- Month name conversion
- Holiday calendar export
- Next/previous holiday finder
- Holiday countdown
- Weekend detection
- Holiday overlap checker

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/justmajkofc/svatky-api.git

# Install dependencies
npm install

# Start server
npm start
```

### Configuration

Edit `config.json` as needed:
```json
{
  "port": 3000
}
```

## 📚 API Endpoints

### Basic Information
- `GET /` - API health check
- `GET /api-docs` - Swagger documentation

### Today and Tomorrow
- `GET /api/today` - Today's information
- `GET /api/tomorrow` - Tomorrow's information

### Public Holidays
- `GET /api/public-holidays/:country` - All holidays for a country
- `GET /api/public-holidays/:country/:month` - Holidays for a month
- `GET /api/public-holidays/:country/:month/:day` - Holidays for a specific day
- `GET /api/public-holidays/search/:title` - Search holidays
- `GET /api/public-holidays/:country/stats` - Holiday statistics
- `GET /api/public-holidays/:country/next` - Next upcoming holiday
- `GET /api/public-holidays/:country/previous` - Previous holiday
- `GET /api/public-holidays/:country/countdown/:date` - Days until next holiday
- `GET /api/public-holidays/overlap/:date` - Check holiday overlap between countries

### Name Days
- `GET /api/name-days/:country` - All name days for a country
- `GET /api/name-days/:country/:month` - Name days for a month
- `GET /api/name-days/:country/:month/:day` - Name days for a specific day
- `GET /api/name-days/:country/search/:name` - Search name days
- `GET /api/name-days/:country/popular` - Most common name days

### Calendar
- `GET /api/calendar/:country/:month` - Calendar information for a month
- `GET /api/day/:country/:month/:day` - Information for a specific day
- `GET /api/day/:country/:month/:day/weekend` - Check if date is weekend

### Utility Endpoints
- `GET /api/easter/:year` - Calculate Easter date
- `GET /api/months/name/:number` - Get month name from number
- `GET /api/months/number/:name` - Get month number from name
- `GET /api/date/validate/:date` - Validate date format
- `GET /api/date/format/:date/:format` - Format date in different formats

## 📝 Usage Example

### Get Today's Information
```bash
curl http://localhost:3000/api/today
```

Response:
```json
{
  "date": "2024-03-19",
  "holidays": {
    "cs": [
      {
        "title": "Czech Statehood Day",
        "type": "holidays"
      }
    ],
    "sk": []
  },
  "nameDays": {
    "cs": "Josef",
    "sk": "Jozef"
  }
}
```

## 🔧 Technologies

- Node.js
- Express.js
- Swagger UI
- JSON

## 📄 License

MIT

## 👥 Contributors

- [justmajkofc](https://github.com/justmajkofc)

## 🤝 Support

If you find a bug or have a suggestion for improvement, please create an issue or pull request.

## 📊 Data Source

This API uses data from the [czech-slovak-holidays](https://github.com/justmajkofc/czech-slovak-holidays) dataset, which I created and maintain.

---

<a id="czech"></a>
# Česká verze

REST API pro získávání informací o státních svátcích a jmeninách v České a Slovenské republice.

## 🌟 Funkce

- Státní svátky pro ČR a SR
- Jmeniny pro ČR a SR
- Informace o dnešním a zítřejším dni
- Vyhledávání svátků a jmenin
- Statistiky svátků
- Výpočet Velikonoc
- Převod názvů měsíců
- Export kalendáře
- Vyhledání dalšího/předchozího svátku
- Odpočet do svátku
- Detekce víkendu
- Kontrola překrývání svátků

## 🚀 Rychlý start

### Instalace

```bash
# Klonování repozitáře
git clone https://github.com/justmajkofc/svatky-api.git

# Instalace závislostí
npm install

# Spuštění serveru
npm start
```

### Konfigurace

Upravte `config.json` podle potřeby:
```json
{
  "port": 3000
}
```

## 📚 API Endpointy

### Základní informace
- `GET /` - Kontrola funkčnosti API
- `GET /api-docs` - Swagger dokumentace

### Dnešní a zítřejší den
- `GET /api/today` - Informace o dnešním dni
- `GET /api/tomorrow` - Informace o zítřejším dni

### Státní svátky
- `GET /api/public-holidays/:country` - Všechny svátky pro zemi
- `GET /api/public-holidays/:country/:month` - Svátky pro měsíc
- `GET /api/public-holidays/:country/:month/:day` - Svátky pro konkrétní den
- `GET /api/public-holidays/search/:title` - Vyhledávání svátků
- `GET /api/public-holidays/:country/stats` - Statistiky svátků
- `GET /api/public-holidays/:country/next` - Další nadcházející svátek
- `GET /api/public-holidays/:country/previous` - Předchozí svátek
- `GET /api/public-holidays/:country/countdown/:date` - Počet dní do dalšího svátku
- `GET /api/public-holidays/overlap/:date` - Kontrola překrývání svátků mezi zeměmi

### Jmeniny
- `GET /api/name-days/:country` - Všechny jmeniny pro zemi
- `GET /api/name-days/:country/:month` - Jmeniny pro měsíc
- `GET /api/name-days/:country/:month/:day` - Jmeniny pro konkrétní den
- `GET /api/name-days/:country/search/:name` - Vyhledávání jmenin
- `GET /api/name-days/:country/popular` - Nejčastější jmeniny

### Kalendář
- `GET /api/calendar/:country/:month` - Kalendářní informace pro měsíc
- `GET /api/day/:country/:month/:day` - Informace pro konkrétní den
- `GET /api/day/:country/:month/:day/weekend` - Kontrola, zda je datum víkend

### Pomocné endpointy
- `GET /api/easter/:year` - Výpočet data Velikonoc
- `GET /api/months/name/:number` - Název měsíce z čísla
- `GET /api/months/number/:name` - Číslo měsíce z názvu
- `GET /api/date/validate/:date` - Validace formátu data
- `GET /api/date/format/:date/:format` - Formátování data v různých formátech

## 📝 Příklad použití

### Získání dnešních informací
```bash
curl http://localhost:3000/api/today
```

Odpověď:
```json
{
  "date": "2024-03-19",
  "holidays": {
    "cs": [
      {
        "title": "Den české státnosti",
        "type": "holidays"
      }
    ],
    "sk": []
  },
  "nameDays": {
    "cs": "Josef",
    "sk": "Jozef"
  }
}
```

## 🔧 Technologie

- Node.js
- Express.js
- Swagger UI
- JSON

## 📄 Licence

MIT

## 👥 Přispěvatelé

- [justmajkofc](https://github.com/justmajkofc)

## 🤝 Podpora

Pokud najdete chybu nebo máte návrh na vylepšení, vytvořte prosím issue nebo pull request.

## 📊 Zdroj dat

Toto API používá data z datasetu [czech-slovak-holidays](https://github.com/justmajkofc/czech-slovak-holidays), jehož jsem autorem a správcem. 
