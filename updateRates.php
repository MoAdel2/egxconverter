<?php
/**
 * ملف تحديث أسعار العملات تلقائياً (نسخة Exception Handling)
 * يستخدم مع Cron Job مرة واحدة يومياً
 */

// 1. الإعدادات
//  ضع مفتاح الـ API الخاص بك هنا

$apiKey = "6ed461c1d337a1a4ae1cee3a";
$baseCurrency = 'USD'; // نستخدم الدولار كمرجع
$url = "https://v6.exchangerate-api.com/v6/{$api_key}/latest/{$baseCurrency}";

$fileName = "rates.json";

try {
    // 2. محاولة جلب البيانات من الرابط
    $response = @file_get_contents($url); // استخدمنا @ لتجاهل التحذير الافتراضي لأننا سنعالجه يدويًا

    if ($response === FALSE) {
        throw new Exception("تعذر الاتصال بالـ API. قد يكون المفتاح خاطئاً أو السيرفر متوقف.");
    }

    // 3. تحويل النص إلى مصفوفة PHP
    $data = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("فشل في قراءة بيانات الـ JSON المستلمة.");
    }

    // 4. التحقق من رد الـ API نفسه
    if (!isset($data['result']) || $data['result'] !== 'success') {
        $errorMsg = $data['error-type'] ?? 'خطأ غير معروف من المصدر';
        throw new Exception("الـ API أرجع خطأ: " . $errorMsg);
    }

    // 5. حفظ البيانات (أسعار الصرف) في ملف rates.json
    $rates = $data['conversion_rates'];
    
    // 4. حفظ الأسعار في ملف rates.json بتنسيق مرتب
    $jsonStatus = file_put_contents($fileName, json_encode($rates, JSON_PRETTY_PRINT));

    if ($jsonStatus === FALSE) {
        throw new Exception("فشل في كتابة الملف. تأكد من صلاحيات المجلد (Permissions).");
    }

    echo "✅ تم التحديث بنجاح: " . date("Y-m-d H:i:s");

} catch (Exception $e) {
    // في حالة حدوث أي خطأ، سيتم القفز هنا
    // يمكنك لاحقاً تطوير هذا الجزء لإرسال إيميل لنفسك يخبرك بالفشل
    http_response_code(500);
    echo "❌ فشل التحديث: " . $e->getMessage();
}

?>