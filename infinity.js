      async function loadRates() {
      // وضع السيرفر: يقرأ فقط من الملف الذي يحدثه الـ PHP
        console.log("الوضع الحالي: Server Mode (PHP)");
        const res = await fetch("rates.json?v=" + new Date().getTime());
        currencyRates = await res.json();}