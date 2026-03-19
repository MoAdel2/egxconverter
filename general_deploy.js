
async function loadRates() {
    const API_KEY = '6ed461c1d337a1a4ae1cee3a';
    if (DEPLOYMENT_MODE === 'server') {
        // وضع السيرفر: يقرأ فقط من الملف الذي يحدثه الـ PHP
        console.log("الوضع الحالي: Server Mode (PHP)");
        const res = await fetch("rates.json?v=" + new Date().getTime());
        currencyRates = await res.json();
    } else {
        // وضع static: يستخدم التخزين المحلي لتوفير الطلبات
        console.time("loadRates total");

        console.log("الوضع الحالي: Static Mode (JavaScript)");
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

        // إذا انتهى الكاش أو غير موجود، نطلب من الـ API مباشرة
        console.time("API request");

        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
        const data = await res.json();
        if (data.result === "success") {
            currencyRates = data.conversion_rates;
            localStorage.setItem(cacheKey, JSON.stringify(currencyRates));
            localStorage.setItem(cacheTimeKey, now);
        }
    }
    console.timeEnd("loadRates total");
}