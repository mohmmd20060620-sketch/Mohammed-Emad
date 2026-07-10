// dashboard.js - خاص بالتحكم في عرض الشاشة الرئيسية فقط
function refreshDashboard() {
    console.log("جاري جلب البيانات من القاعدة...");

    // 1. تحديث الأرصدة في المربعات العلوية
    const balances = DB.getBalances();
    if(document.getElementById('sum-usd')) {
        document.getElementById('sum-usd').innerText = "$ " + balances.USD.toLocaleString();
        document.getElementById('sum-sar').innerText = "SR " + balances.SAR.toLocaleString();
        document.getElementById('sum-yer').innerText = "YR " + balances.YER.toLocaleString();
    }

    // 2. تحديث جدول العمليات الأخيرة
    const operations = JSON.parse(localStorage.getItem('itqan_operations')) || [];
    const listBody = document.getElementById('ops-list');
    
    if (listBody) {
        listBody.innerHTML = ''; // تنظيف الجدول

        if (operations.length === 0) {
            listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">لا توجد عمليات مسجلة</td></tr>';
        } else {
            operations.slice(0, 10).forEach(op => {
                const row = `
                    <tr>
                        <td>${op.date}</td>
                        <td>${op.type}</td>
                        <td><span class="badge bg-gray">${op.network || 'عام'}</span></td>
                        <td>${op.client}</td>
                        <td><b style="color:#0f172a">${op.currency} ${parseFloat(op.amount).toLocaleString()}</b></td>
                        <td><span class="badge bg-blue">مكتمل</span></td>
                        <td><i class="fas fa-print" style="color:#3b82f6; cursor:pointer"></i></td>
                    </tr>
                `;
                listBody.innerHTML += row;
            });
        }
    }
}

// تشغيل الساعة
setInterval(() => {
    const clockEl = document.getElementById('live-clock');
    if(clockEl) clockEl.innerText = new Date().toLocaleString('ar-YE');
}, 1000);

// تنفيذ التحديث فور تحميل الصفحة
window.onload = refreshDashboard;
// مصفوفة السجلات (Audit Logs)
let logs = JSON.parse(localStorage.getItem('system_logs')) || [];

const AuditLogger = {
    // دالة تسجيل عملية جديدة
    log: function(action, details) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('ar-YE'), // التوقيت المحلي لليمن
            userId: currentUser ? currentUser.id : "System",
            userName: currentUser ? currentUser.name : "النظام",
            action: action, // نوع العملية (إرسال حوالة، تعديل سعر صرف، إلخ)
            details: details, // تفاصيل إضافية (المبلغ، رقم الحوالة)
            ipAddress: "192.168.1.100" // يمكنك برمجتها لاحقاً لجلب الـ IP
        };

        logs.unshift(newLog); // إضافة السجل في البداية ليظهر الأحدث أولاً
        localStorage.setItem('system_logs', JSON.stringify(logs));
        console.log("Audit Log Saved:", newLog);
    },

    // دالة جلب كافة السجلات لعرضها للمدير
    getLogs: function() {
        return JSON.parse(localStorage.getItem('system_logs')) || [];
    }
};