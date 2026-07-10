const DB = {
    
    // دالة جلب أرباح العمولات فقط
    // أضف هذه الدالة داخل كائن الـ DB في ملف database.js
// استبدل الدالة القديمة بهذا الكود المطور
getCommissionProfit: function() {
    // 1. جلب العمليات
    const ops = this.getOperations(); 
    
    // 2. تصفية العمليات التي تحتوي على كلمة "عمولة"
    const profitsFromOps = ops.filter(op => 
        (op.type && op.type.includes("عمولة")) || 
        (op.notes && op.notes.includes("عمولة"))
    ).map(op => ({
        // توحيد المسميات لضمان الربط مع الجدول
        date: op.date ? op.date.split('T')[0] : '---',
        client: op.client || op.name || "عميل غير محدد", // يقرأ client أو name
        notes: op.notes || op.type,
        amount: op.amount || op.money || 0, // يقرأ amount أو money
        currency: op.currency || "YER"
    }));

    // 3. جلب الأرباح المضافة يدوياً
    const independentProfits = JSON.parse(localStorage.getItem('itqan_profits') || '[]');
    const formattedIndependent = independentProfits.map(p => ({
        date: p.date ? p.date.split('T')[0] : '---',
        client: p.source || "أرباح مباشرة",
        notes: p.notes || "ربح مضاف يدويًا",
        amount: p.amount || 0,
        currency: p.currency
    }));

    return [...profitsFromOps, ...formattedIndependent];
},
    // دالة جلب أرباح فارق المصارفة
    getExchangeProfit: function() {
        const ops = this.getOperations();
        // تصفية العمليات الخاصة بفوارق الصرف (المصارفة)
        return ops.filter(op => op.type === "فارق صرف" || op.type === "أرباح مصارفة");
    },
    
    
       // إدارة العمليات
    getOperations: function() {
        const data = localStorage.getItem('itqan_operations');
        return data ? JSON.parse(data) : [];
    },
      // --- العمليات (الحوالات والقيود) ---
   // إضافة عملية جديدة
    addOperation: function(op) {
        const ops = this.getOperations();
        ops.push(op);
        localStorage.setItem('itqan_operations', JSON.stringify(ops));
        // بعد حفظ البيانات بنجاح
window.location.href = 'commission-reports.html';
    },
   // --- إدارة العملاء ---
// ضع هذا الجزء داخل كائن DB

    // جلب قائمة العملاء من ذاكرة المتصفح
  // جلب العملاء
    getClients: function() {
        const data = localStorage.getItem('itqan_clients');
        return data ? JSON.parse(data) : [];
    },

     // حفظ أرصدة الشبكات في قاعدة البيانات
 // --- أرصدة الشبكات ---
   // جلب أرصدة الشبكات
    getNetworkBalances: function() {
        const data = localStorage.getItem('itqan_network_balances');
        return data ? JSON.parse(data) : {};
    },
     // دالة حفظ أرصدة الشبكات (التي أرسلتها أنت)
   // حفظ أرصدة الشبكات
    saveNetworkBalances: function(newData) {
        localStorage.setItem('itqan_network_balances', JSON.stringify(newData));
    },

    // أضف هذه الدالة داخل كائن DB في ملف database.js
getAllOperationsReport: function() {
    // جلب كافة العمليات المخزنة دون استثناء
    const data = localStorage.getItem('itqan_operations');
    return data ? JSON.parse(data) : [];
},
    // أضف هذه الدالة داخل كائن DB لإصلاح الخطأ

    
    // --- محرك حركة الصناديق ---
// أضف هذه الدالة داخل كائن DB في ملف database.js

    getBoxMovement: function(currencyType) {
        // 1. جلب كافة العمليات المالية من المخزن الرئيسي itqan_operations
        const allOps = this.getOperations(); 
        
        // 2. فلترة العمليات لتشمل فقط العملة المختارة (YER أو SAR أو USD)
        return allOps.filter(op => op.currency === currencyType);
    },
    
    // --- محرك كشف الحساب ---
// ضع هذا الجزء داخل كائن DB

    // البحث عن جميع العمليات الخاصة بعميل معين فقط
    getClientStatement: function(clientName) {
        const allOps = this.getOperations();
        return allOps.filter(op => op.client === clientName);
    },
 

    // حفظ عميل جديد في النظام
    saveClient: function(clientData) {
        let clients = this.getClients();
        clients.push(clientData);
        localStorage.setItem('itqan_clients', JSON.stringify(clients));
    },
    // إدارة المستخدمين
   getUsers: function() {
    const data = localStorage.getItem('itqan_users');
    
    // إذا وجدت بيانات مخزنة، قم بإرجاعها
    if (data) return JSON.parse(data);
    
    // إذا لم توجد، أنشئ مستخدمين افتراضيين مع بيانات دخول كاملة
    const defaultUsers = [
        { 
            id: "admin123",
            name: "عبدالعظيم", // الاسم الشخصي
            username: "admin", // اسم الدخول
            password: "123",   // كلمة المرور
            role: "مدير النظام",
            permissions: {
                send: true,
                receive: true,
                reports: true,
                exchange: true,
                admin: true,
                delete: true 
            }
        },
        { 
            id: "user123",
            name: "أحمد",
            username: "user",
            password: "123",
            role: "محاسب",
            permissions: {
                send: true,
                receive: true,
                reports: false,
                exchange: true,
                admin: false,
                delete: false 
            }
        }
    ];

    // حفظ المستخدمين الافتراضيين في التخزين المحلي فوراً
    localStorage.setItem('itqan_users', JSON.stringify(defaultUsers));
    return defaultUsers;
},
    isAdmin: function() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        return currentUser && currentUser.role === 'مدير نظام';
    },


    // إدارة أرصدة الصناديق
    getBalances: function() {
        const data = localStorage.getItem('itqan_balances');
        return data ? JSON.parse(data) : { USD: 0, SAR: 0, YER: 0 };
    },

    saveBalances: function(balances) {
        localStorage.setItem('itqan_balances', JSON.stringify(balances));
    },

    // إدارة أسعار الصرف
    getExchangeRates: function() {
        const data = localStorage.getItem('itqan_rates');
        return data ? JSON.parse(data) : {
            USD_BUY: 525, USD_SELL: 535,
            SAR_BUY: 139.5, SAR_SELL: 140.5
        };
    },

    updateSingleRate: function(key, value) {
        if (!value || value <= 0) return;
        let rates = this.getExchangeRates();
        rates[key] = parseFloat(value);
        localStorage.setItem('itqan_rates', JSON.stringify(rates));
        if (typeof Dashboard !== 'undefined') Dashboard.updateStats();
    },

    // إدارة العمولات والأرباح
    addProfit: function(profitData) {
        let profits = JSON.parse(localStorage.getItem('itqan_profits') || '[]');
        const newProfit = {
            id: Date.now(),
            date: new Date().toISOString(),
            source: profitData.source,
            amount: parseFloat(profitData.amount),
            currency: profitData.currency,
            notes: profitData.notes
        };
        profits.push(newProfit);
        localStorage.setItem('itqan_profits', JSON.stringify(profits));
    }
};

// 3. محرك الإحصائيات (Dashboard)
const Dashboard = {
    updateStats: function() {
        const rates = DB.getExchangeRates();
        const allOps = DB.getOperations();

        // حساب الأرصدة الفعلية من واقع العمليات
        const realBalances = {
            YER: 0, SAR: 0, USD: 0
        };

        allOps.forEach(op => {
            const isEntry = op.type.includes('قبض') || op.type.includes('وارد') || op.type.includes('دائن') || op.type.includes('افتتاحي');
            const val = Math.abs(op.amount);
            if(realBalances.hasOwnProperty(op.currency)) {
                realBalances[op.currency] += isEntry ? val : -val;
            }
        });

        // تحديث الأرقام في الشاشة الرئيسية
        const map = {
            'display-USD-SELL': rates.USD_SELL,
            'display-USD-BUY': rates.USD_BUY,
            'display-SAR-SELL': rates.SAR_SELL,
            'display-SAR-BUY': rates.SAR_BUY,
            'balance-YER': realBalances.YER,
            'balance-SAR': realBalances.SAR,
            'balance-USD': realBalances.USD
        };

        for (let id in map) {
            let el = document.getElementById(id);
            if(el) el.innerText = (map[id] || 0).toLocaleString();
        }

        // حساب إجمالي السيولة بالريال اليمني
        let totalInYER = realBalances.YER + (realBalances.SAR * rates.SAR_BUY) + (realBalances.USD * rates.USD_BUY);
        const liqEl = document.getElementById('totalLiquidity') || document.getElementById('total-liquidity');
        if(liqEl) liqEl.innerText = totalInYER.toLocaleString() + " YER";
    }
};

// 4. وظائف عرض البيانات (للجداول)
function displayRecentOperations() {
    const tableBody = document.getElementById('recent-ops-table');
    if (!tableBody) return;

    const allOps = DB.getOperations();
    const recentOps = allOps.slice(0, 5); 

    tableBody.innerHTML = ''; 
    recentOps.forEach(op => {
        const isEntry = op.type.includes('قبض') || op.type.includes('وارد') || op.type.includes('دائن');
        const row = `
            <tr>
                <td>${new Date(op.date).toLocaleDateString('ar-YE')}</td>
                <td><span class="badge">${op.type}</span></td>
                <td>${op.client}</td>
                <td dir="ltr" style="font-weight:bold; color:${isEntry ? '#10b981' : '#ef4444'}">
                    ${isEntry ? '+' : '-'}${op.amount.toLocaleString()} ${op.currency}
                </td>
                <td><button onclick="alert('ملاحظات: ${op.notes}')" class="btn-view"><i class="fas fa-eye"></i></button></td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// 5. تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if(typeof Dashboard !== 'undefined') Dashboard.updateStats();
    if(typeof displayRecentOperations === 'function') displayRecentOperations();
}); // تأكد من وجود الـ }); هنا