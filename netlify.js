async function loadRates() {

    console.time("loadRates total");

    const API_KEY = '6ed461c1d337a1a4ae1cee3a';

    const cacheKey = 'currency_rates_data';
    const cacheTimeKey = 'currency_rates_timestamp';
    const oneDay = 24 * 60 * 60 * 1000;

    const lastSaved = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    if (lastSaved && (now - lastSaved < oneDay)) {

        console.time("loadRates cache");

        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            currencyRates = JSON.parse(cachedData);
            console.timeEnd("loadRates cache");
            console.timeEnd("loadRates total");
            return;
        }
    }

    console.time("API request");

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();

    console.timeEnd("API request");

    if (data.result === "success") {
        currencyRates = data.conversion_rates;
        localStorage.setItem(cacheKey, JSON.stringify(currencyRates));
        localStorage.setItem(cacheTimeKey, now);
    }

    console.timeEnd("loadRates total");
}   