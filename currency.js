/**
 * إعدادات وضع التشغيل:
 * اختر 'static' إذا كنت ترفع الموقع على Vercel (تحديث عبر المتصفح).
 * اختر 'server' إذا كنت ترفع الموقع على InfinityFree (تحديث عبر PHP + Cron Job).
 */
const DEPLOYMENT_MODE = 'static';

// مفتاح الـ API الخاص بك
const API_KEY = '6ed461c1d337a1a4ae1cee3a';

// متغيرات للتحكم ومنع التكرار
let currencyLoaded = false;
let isFetching = false;
let currencyRates = {};
let currencyNames = {};

// أشهر العملات (نضعها خارج الدالة لزيادة الأداء)
const popularCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "CNY","EGP"];

// ربط العملة بكود العلم (تم تصحيح أكواد الدول لـ FlagCDN)
const currencyFlags = {
    USD: "us",
    EUR: "eu", // eu للاتحاد الأوروبي
    GBP: "gb",
    JPY: "jp",
    CNY: "cn",
    SAR: "sa", // تم التصحيح
    AED: "ae", // تم التصحيح
    EGP: "eg", // تم التصحيح (حروف صغيرة)
    CHF: "ch",
    CAD: "ca"
};

// الدالة الأساسية لبدء التحميل
async function initCurrencyConverter() {
    // لمنع التحميل المزدوج لو تم استدعاء الدالة مرتين في نفس الوقت
    if (currencyLoaded || isFetching) return;
    isFetching = true;

    console.time("initCurrencyConverter total");

    try {
        console.time("load currencies.json");
        const namesRes = await fetch("currencies.json");
        currencyNames = await namesRes.json();
        console.timeEnd("load currencies.json");

        console.time("loadRates");
        await loadRates(); // ✅ التحميل أولاً قبل بناء القائمة
        console.timeEnd("loadRates");

        currencyLoaded = true;

        console.time("build dropdown");
        // لو المستخدم حالياً واقف على قسم العملات، قم ببناء القائمة
        if (typeof activeCategory !== 'undefined' && activeCategory === "currency") {
            loadCurrencyUnits();
        }
        console.timeEnd("build dropdown");

    } catch (error) {
        console.error("حدث خطأ أثناء تهيئة العملات:", error);
    } finally {
        isFetching = false;
    }

    console.timeEnd("initCurrencyConverter total");
}
// -------------------------------------------------
loadRates()
// ------------------------------------
function loadCurrencyUnits() {
    const from = document.getElementById("fromUnit");
    const to = document.getElementById("toUnit");
    
    if (!from || !to) return;

    from.innerHTML = "";
    to.innerHTML = "";

    const fragmentFrom = document.createDocumentFragment();
    const fragmentTo = document.createDocumentFragment();

    Object.keys(currencyRates).forEach(code => {
        const name = currencyNames[code] ? currencyNames[code].name : code;

        const option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = `${name} (${code})`;

        const option2 = option1.cloneNode(true);

        fragmentFrom.appendChild(option1);
        fragmentTo.appendChild(option2);
    });

    from.appendChild(fragmentFrom);
    to.appendChild(fragmentTo);

    // اختيار افتراضي ذكي
    from.value = "USD";
    if (to.querySelector('option[value="EGP"]')) {
        to.value = "EGP";
    } else {
        to.selectedIndex = 1;
    }

    convertCurrency();
}

function convertCurrency() {
    const inputField = document.getElementById("inputValue");
    const resultField = document.getElementById("result");
    const fromUnit = document.getElementById("fromUnit").value;
    const toUnit = document.getElementById("toUnit").value;

    if (!inputField || !resultField || !currencyRates[fromUnit] || !currencyRates[toUnit]) return;

    const value = parseFloat(inputField.value) || 0;

    if (value === 0) {
        resultField.innerText = "0";
    } else {
        const result = (value / currencyRates[fromUnit]) * currencyRates[toUnit];
        resultField.innerText = result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        });
    }

    buildCurrencyTable(currencyRates, fromUnit);
}

function buildCurrencyTable(rates, base) {
    let html = `<div class="ratesTable">`;

    popularCurrencies.forEach(currency => {
        if (currency === base || !rates[currency]) return;

        const rate = rates[currency] / rates[base];
        const name = currencyNames[currency] ? currencyNames[currency].name : currency;
        const flag = currencyFlags[currency];

        html += `
        <div class="rateRow">
            <div class="rateInfo">
                <span class="rateMain">
                    <strong>1</strong> ${base} = 
                    <strong>${rate.toFixed(4)}</strong> ${currency}
                </span>
                <span class="currencyName">${name}</span>
            </div>
            ${flag ? `<img class="flag" src="https://flagcdn.com/24x18/${flag}.png" alt="${currency}">` : ``}
        </div>
        `;
    });

    html += `</div>`;

    document.getElementById("curUnits").innerHTML = html;
}