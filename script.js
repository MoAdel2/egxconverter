// swap units
function swapUnits(){
    let from = document.getElementById("fromUnit")
    let to = document.getElementById("toUnit")

    let temp = from.value
    from.value = to.value
    to.value = temp

    // تأكد من وجود الدالة convert في units.js
    if (typeof convert === "function") {
        convert();
    }
}

// copy result
function copyText(btn){
    let text = document.getElementById("result").innerText.trim()

    if(!text || text === "0") return

    if(navigator.clipboard){
        navigator.clipboard.writeText(text)
    } else {
        let textarea = document.createElement("textarea")
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
    }

    btn.innerHTML = "✔"

    setTimeout(function(){
        btn.innerHTML = `<svg viewBox='0 0 24 24' width='18' height='18'
         fill='none' stroke='currentColor'stroke-width='2'><rect x='9' y='9' 
         width='13' height='13' rx='2' ry='2'></rect><path d='M5 
         15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path></svg>`
    }, 1200)
}

// --------------------------------------------
// دالة التبديل بين الوضعين dark/light
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById("themeIcon");

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        if (themeIcon) themeIcon.innerText = "🌙"; 
        localStorage.setItem("theme", "light");
    } else {
        if (themeIcon) themeIcon.innerText = "☀️";
        localStorage.setItem("theme", "dark");
    }
}

// تهيئة الوضع عند تحميل الصفحة (IIFE)
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const themeIcon = document.getElementById("themeIcon");
    const themeBtn = document.getElementById("themeBtn"); 

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (themeIcon) themeIcon.innerText = "🌙";
    } else if (savedTheme === "dark") {
        document.body.classList.remove("light-mode");
        if (themeIcon) themeIcon.innerText = "☀️";
    } else {
        const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        if (systemPrefersLight) {
            document.body.classList.add("light-mode");
            if (themeIcon) themeIcon.innerText = "🌙";
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }
})();

// تحميل العملات مسبقاً في الخلفية (Preloading) لتحسين تجربة المستخدم
document.addEventListener("DOMContentLoaded", () => {
    if (typeof initCurrencyConverter === "function") {
        initCurrencyConverter(); 
    }
});
// ============================================
//   Google Translate Optimized Bridge
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("currentLangBtn");
    const dropdown = document.getElementById("languageDropdown");
    const options = document.querySelectorAll(".lang-option");

    const flagEl = btn?.querySelector(".lang-flag");
    const nameEl = btn?.querySelector(".lang-name");

    if (!btn || !dropdown) return;

    let currentLang = localStorage.getItem("preferredLang") || "en";

    // ===============================
    // تحديث واجهة الزر
    // ===============================
    function updateLangUI(lang){

        const selected = document.querySelector(`.lang-option[data-lang="${lang}"]`);

        if(!selected || !flagEl || !nameEl) return;

        const flag = selected.querySelector(".flag-icon")?.textContent || "";
        const name = selected.textContent.replace(flag,"").trim();

        flagEl.textContent = flag;
        nameEl.textContent = name;
    }

    // ===============================
    // تمييز اللغة المختارة
    // ===============================
    function highlightSelected(lang){

        options.forEach(opt=>{
            opt.classList.remove("selected");

            if(opt.dataset.lang === lang){
                opt.classList.add("selected");
            }
        });
    }

    // ===============================
    // تشغيل Google Translate
    // ===============================
    function applyTranslate(lang){

        const select = document.querySelector(".goog-te-combo");

        if(!select){
            console.warn("Google Translate لم يتم تحميله بعد");
            return;
        }

        select.value = lang;
        select.dispatchEvent(new Event("change"));
    }

    // ===============================
    // تحميل اللغة المحفوظة
    // ===============================
    function loadSavedLanguage(){

        updateLangUI(currentLang);
        highlightSelected(currentLang);

        if(currentLang !== "en"){
            applyTranslate(currentLang);
        }
    }

    // ===============================
    // فتح القائمة
    // ===============================
    btn.addEventListener("click",(e)=>{

        e.stopPropagation();
        dropdown.classList.toggle("active");

    });

    // إغلاق القائمة
    document.addEventListener("click",(e)=>{

        if(!dropdown.contains(e.target) && !btn.contains(e.target)){
            dropdown.classList.remove("active");
        }

    });

    // اختيار لغة
    options.forEach(option=>{

        option.addEventListener("click",()=>{

            const lang = option.dataset.lang;

            updateLangUI(lang);
            highlightSelected(lang);

            dropdown.classList.remove("active");

            localStorage.setItem("preferredLang",lang);

            applyTranslate(lang);

        });

    });

    // تحميل اللغة بعد تحميل Google
    const observer = new MutationObserver(()=>{

        if(document.querySelector(".goog-te-combo")){
            loadSavedLanguage();
            observer.disconnect();
        }

    });

    observer.observe(document.body,{
        childList:true,
        subtree:true
    });

});

function removeGoogleBanner() {

    const frame = document.querySelector('.goog-te-banner-frame');

    if(frame){
        frame.style.display = 'none';
    }

    document.body.style.top = "0px";
}

setInterval(removeGoogleBanner,500);


(function(hkl){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = hkl || {};
s.src = "\/\/waterloggedkind.com\/c.D_9A6Yb\/2v5jlqSDWvQ\/9cNkjGgF4\/Nbz\/ISyVNLSm0J2iOQD\/gm3NMbjiIo5l";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
