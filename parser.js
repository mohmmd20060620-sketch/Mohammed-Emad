function parseNotice() {
    const text = document.getElementById('rawNotice').value;
    
    // محرك البحث عن البيانات باستخدام التعبيرات النمطية (Regex)
    const amountRegex = /(\d{1,3}(,\d{3})*(\.\d+)?)/; // استخراج الأرقام
    const networks = ["النجم", "الامتياز", "المميز", "الحزمي", "العالمي"];
    const currencies = { "دولار": "USD", "سعودي": "SAR", "يمني": "YER" };

    let detectedAmount = text.match(amountRegex) ? text.match(amountRegex)[0].replace(/,/g, '') : '';
    let detectedNetwork = networks.find(n => text.includes(n)) || "عام";
    
    let detectedCurrency = "YER"; // الافتراضي
    for (let key in currencies) {
        if (text.includes(key)) {
            detectedCurrency = currencies[key];
            break;
        }
    }

    // تعبئة الحقول تلقائياً في النموذج (تأكد أن IDs الحقول تطابق هذه الأسماء)
    if(document.getElementById('amount')) document.getElementById('amount').value = detectedAmount;
    if(document.getElementById('network')) document.getElementById('network').value = detectedNetwork;
    if(document.getElementById('currency')) document.getElementById('currency').value = detectedCurrency;

    alert("✅ تم تحليل الرسالة وتعبئة البيانات بنجاح، يرجى مراجعتها قبل الحفظ.");
}