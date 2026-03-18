const categories = {

    currency: [], // سيتم ملؤها بواسطة currency.js

    length: [
        { name: "Meter", symbol: "m", base: 1 },
        { name: "Kilometer", symbol: "km", base: 1000 },
        { name: "Centimeter", symbol: "cm", base: 0.01 },
        { name: "Millimeter", symbol: "mm", base: 0.001 },
        { name: "Mile", symbol: "mi", base: 1609.344 },
        { name: "Yard", symbol: "yd", base: 0.9144 },
        { name: "Foot", symbol: "ft", base: 0.3048 },
        { name: "Inch", symbol: "in", base: 0.0254 },
        { name: "Nautical Mile", symbol: "nmi", base: 1852 }
    ],

    weight: [
        { name: "Kilogram", symbol: "kg", base: 1 },
        { name: "Gram", symbol: "g", base: 0.001 },
        { name: "Milligram", symbol: "mg", base: 0.000001 },
        { name: "Metric Ton", symbol: "t", base: 1000 },
        { name: "Pound", symbol: "lb", base: 0.453592 },
        { name: "Ounce", symbol: "oz", base: 0.0283495 },
        { name: "Stone", symbol: "st", base: 6.35029 }
    ],

    volume: [
        { name: "Liter", symbol: "L", base: 1 },
        { name: "Milliliter", symbol: "mL", base: 0.001 },
        { name: "Cubic Meter", symbol: "m3", base: 1000 },
        { name: "Gallon (US)", symbol: "gal", base: 3.78541 },
        { name: "Gallon (UK)", symbol: "gal UK", base: 4.54609 },
        { name: "Quart", symbol: "qt", base: 0.946353 },
        { name: "Pint", symbol: "pt", base: 0.473176 },
        { name: "Cup", symbol: "cup", base: 0.236588 },
        { name: "Fluid Ounce", symbol: "fl oz", base: 0.0295735 }
    ],

    area: [
        { name: "Square Meter", symbol: "m2", base: 1 },
        { name: "Square Kilometer", symbol: "km2", base: 1000000 },
        { name: "Square Centimeter", symbol: "cm2", base: 0.0001 },
        { name: "Hectare", symbol: "ha", base: 10000 },
        { name: "Acre", symbol: "ac", base: 4046.86 }
    ],

    speed: [
        { name: "Meter per Second", symbol: "m/s", base: 1 },
        { name: "Kilometer per Hour", symbol: "km/h", base: 0.277778 },
        { name: "Mile per Hour", symbol: "mph", base: 0.44704 },
        { name: "Foot per Second", symbol: "ft/s", base: 0.3048 },
        { name: "Knot", symbol: "kn", base: 0.514444 }
    ],

    time: [
        { name: "Second", symbol: "s", base: 1 },
        { name: "Millisecond", symbol: "ms", base: 0.001 },
        { name: "Minute", symbol: "min", base: 60 },
        { name: "Hour", symbol: "h", base: 3600 },
        { name: "Day", symbol: "d", base: 86400 },
        { name: "Week", symbol: "wk", base: 604800 },
        { name: "Month", symbol: "mo", base: 2629746 },
        { name: "Year", symbol: "yr", base: 31556952 }
    ]
}

let activeCategory = "length"

function buildCategories() {
    const container = document.getElementById("categories")

    Object.keys(categories).forEach(cat => {
        const btn = document.createElement("button")
        btn.innerText = cat
        btn.onclick = () => {
            activeCategory = cat
            document.querySelectorAll(".categories button").forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            loadUnits()
        }
        if (cat === "length") btn.classList.add("active")
        container.appendChild(btn)
    })
}

function loadUnits() {
    const curUnits = document.getElementById("curUnits");
    const regUnits = document.getElementById("regUnits");

    if (activeCategory === "currency") {
        curUnits.style.display = "block";
        regUnits.style.display = "none";

        // استخدام المتغير currencyLoaded الموجود في currency.js
        if (!currencyLoaded) {
            initCurrencyConverter();
        } else {
            loadCurrencyUnits();
        }
        return;
    }

    // إخفاء جدول العملات في باقي الفئات
    curUnits.style.display = "none";
    regUnits.style.display = "block";

    const from = document.getElementById("fromUnit")
    const to = document.getElementById("toUnit")

    from.innerHTML = ""
    to.innerHTML = ""

    categories[activeCategory].forEach((u, i) => {
        from.innerHTML += `<option value="${i}">${u.name} (${u.symbol})</option>`
        to.innerHTML += `<option value="${i}">${u.name} (${u.symbol})</option>`
    })

    to.selectedIndex = 1
    convert()
}

function convert() {
    if (activeCategory === "currency") {
        convertCurrency()
        return
    }

    let value = parseFloat(document.getElementById("inputValue").value) || 0
    let from = categories[activeCategory][document.getElementById("fromUnit").value]
    let to = categories[activeCategory][document.getElementById("toUnit").value]

    let base = value * from.base
    let result = base / to.base

    document.getElementById("result").innerText = parseFloat(result.toFixed(6))

    //----------------------------------
    let info = from.base / to.base

    document.getElementById("regUnits").innerHTML =
        `1 ${from.name} (${from.symbol}) = ${parseFloat(info.toFixed(6))} ${to.name} (${to.symbol})`
    //----------------------------------
}

// بناء الواجهة عند تحميل الصفحة
buildCategories();
loadUnits();

// ✅ إضافة مستمعي الأحداث لضمان التحديث التلقائي عند أي تغيير
document.getElementById("fromUnit").addEventListener("change", convert);
document.getElementById("toUnit").addEventListener("change", convert);
document.getElementById("inputValue").addEventListener("input", convert);