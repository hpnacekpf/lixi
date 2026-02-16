// ========================================
// Lì Xì May Mắn - Random Lucky Money
// ========================================

const DENOMINATIONS = [10000, 20000, 50000, 100000, 200000, 500000];

const MESSAGES = {
    10000: { text: "Của ít lòng nhiều! 😊", emoji: "😊" },
    20000: { text: "Lộc nhỏ đầu năm! 🌱", emoji: "🌱" },
    50000: { text: "May mắn đang đến! 🍀", emoji: "🍀" },
    100000: { text: "Tài lộc dồi dào! 💰", emoji: "💰" },
    200000: { text: "Phú quý tại trời! 🌟", emoji: "🌟" },
    500000: { text: "Đại phát tài! 🎉🎊🧧", emoji: "🎉" }
};

// ========================================
// EmailJS Configuration
// Hướng dẫn cấu hình:
// 1. Đăng ký tại https://www.emailjs.com (miễn phí 200 email/tháng)
// 2. Tạo Email Service (Gmail/Outlook) → lấy Service ID
// 3. Tạo Email Template với các biến:
//    {{user_name}}, {{bank_name}}, {{bank_account}},
//    {{amount}}, {{turn}}, {{total}}, {{time}}
// 4. Lấy Public Key từ Account > API Keys
// 5. Điền các giá trị bên dưới:
// ========================================
const EMAILJS_PUBLIC_KEY = 'N7KjQ8eFE3HQuIPEN';     // ← Thay bằng Public Key của bạn
const EMAILJS_SERVICE_ID = 'service_1yuemyp';     // ← Thay bằng Service ID
const EMAILJS_TEMPLATE_ID = 'template_csmqr6c';   // ← Thay bằng Template ID

let history = [];
let isAnimating = false;
let isCelebrating = false;
let userData = {
    name: '',
    bankName: '',
    bankAccount: ''
};

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('[EmailJS] Initialized successfully');
    } else {
        console.error('[EmailJS] SDK not loaded! Check internet connection.');
    }

    createParticles();
    createBlossoms();
    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);
});

// ========================================
// Form Submission
// ========================================
function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const bankName = document.getElementById('bankName').value.trim();
    const bankAccount = document.getElementById('bankAccount').value.trim();

    if (!name || !bankName || !bankAccount) {
        return false;
    }

    // Store user data
    userData.name = name;
    userData.bankName = bankName;
    userData.bankAccount = bankAccount;

    // Transition from form to game
    const formSection = document.getElementById('formSection');
    const gameSection = document.getElementById('gameSection');
    const displayName = document.getElementById('displayName');

    formSection.style.opacity = '0';
    formSection.style.transform = 'translateY(-20px)';
    formSection.style.transition = 'all 0.4s ease-out';

    setTimeout(() => {
        formSection.style.display = 'none';
        gameSection.style.display = 'flex';
        displayName.textContent = name;

        // Trigger entrance animation
        gameSection.style.opacity = '0';
        gameSection.style.transform = 'translateY(20px)';
        gameSection.style.transition = 'all 0.5s ease-out';

        requestAnimationFrame(() => {
            gameSection.style.opacity = '1';
            gameSection.style.transform = 'translateY(0)';
            drawWheel(); // Draw wheel immediately
        });
    }, 400);

    return false;
}

// ========================================
// Background Effects
// ========================================
function createParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 480 ? 15 : 25;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const isGold = Math.random() > 0.5;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            background: ${isGold
                ? `radial-gradient(circle, #f1c40f, #d4ac0d)`
                : `radial-gradient(circle, #e74c3c, #c0392b)`};
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }
}

function createBlossoms() {
    const container = document.getElementById('blossoms');
    const blossomEmojis = ['🌸', '🏵️', '✿', '❀', '🌺'];
    const count = window.innerWidth < 480 ? 8 : 15;

    for (let i = 0; i < count; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'blossom';
        blossom.textContent = blossomEmojis[Math.floor(Math.random() * blossomEmojis.length)];
        blossom.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 0.8 + 0.8}rem;
            animation-duration: ${Math.random() * 10 + 8}s;
            animation-delay: ${Math.random() * 15}s;
            opacity: ${Math.random() * 0.4 + 0.3};
        `;
        container.appendChild(blossom);
    }
}

// ========================================
// Format Currency
// ========================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// ========================================
// Random Logic
// ========================================
function getRandomAmount() {
    // Weighted random - tỉ lệ theo yêu cầu:
    // 10k=10%, 20k=50%, 50k=30%, 100k=6.5%, 200k=3%, 500k=0.5%
    const weights = [10, 50, 30, 6.5, 3, 0.5];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return DENOMINATIONS[i];
        }
    }
    return DENOMINATIONS[0];
}

// ========================================
// Mode Toggle
// ========================================
let wheelAngle = 0;
let wheelSpinning = false;

// Mode toggle removed - Wheel is default/only mode

function startRandom() {
    if (isAnimating) return;
    startSpin();
}

// Shake logic removed

// ========================================
// Spin Wheel Mode
// ========================================
const WHEEL_COLORS = [
    '#e74c3c', '#f39c12', '#c0392b', '#d4ac0d', '#922b21', '#f1c40f'
];

const WHEEL_SIZE = 320;

function drawWheel(highlightIndex) {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    // Responsive sizing
    const size = Math.min(WHEEL_SIZE, window.innerWidth - 80);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 2;
    const segCount = DENOMINATIONS.length;
    const segAngle = (Math.PI * 2) / segCount;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < segCount; i++) {
        const startAngle = wheelAngle + i * segAngle;
        const endAngle = startAngle + segAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        const isHighlighted = highlightIndex === i;
        ctx.fillStyle = isHighlighted
            ? '#ffd700'
            : WHEEL_COLORS[i % WHEEL_COLORS.length];
        ctx.fill();

        // Segment border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textR = radius * 0.65;
        ctx.font = `bold ${Math.max(12, size / 22)}px 'Be Vietnam Pro', sans-serif`;
        ctx.fillStyle = isHighlighted ? '#641e16' : '#fff5e1';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;

        // Format short label
        const label = DENOMINATIONS[i] >= 1000
            ? (DENOMINATIONS[i] / 1000) + 'k'
            : DENOMINATIONS[i].toString();
        ctx.fillText(label, textR, 0);
        ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#641e16';
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#f1c40f';
    ctx.font = `bold ${Math.max(14, size / 18)}px 'Be Vietnam Pro', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'transparent';
    ctx.fillText('LÌ XÌ', cx, cy);
}

function startSpin() {
    if (wheelSpinning) return;
    isAnimating = true;
    wheelSpinning = true;

    const randomBtn = document.getElementById('randomBtn');
    randomBtn.disabled = true;
    randomBtn.querySelector('.btn-text').textContent = 'Đang quay...';

    const amount = getRandomAmount();
    const targetIndex = DENOMINATIONS.indexOf(amount);
    const segAngle = (Math.PI * 2) / DENOMINATIONS.length;

    // Calculate target angle: pointer at top (270° = -π/2)
    // Random position within the segment (with 10% padding on each side to avoid line ambiguity)
    const padding = segAngle * 0.1;
    const randomOffset = padding + Math.random() * (segAngle - 2 * padding);
    const targetPosition = targetIndex * segAngle + randomOffset;

    // We want the top (-π/2) to point at this position
    // So wheelAngle should be: -π/2 - targetPosition + full rotations
    // Increase rotations to 15-25 rounds (was 5-7)
    const fullRotations = (Math.floor(Math.random() * 10) + 15) * Math.PI * 2;
    const targetAngle = -Math.PI / 2 - targetPosition + fullRotations;

    const startAngle = wheelAngle;
    const totalSpin = targetAngle - startAngle;
    // Increase duration to 8-10 seconds to accommodate more rotations
    const duration = 8000 + Math.random() * 2000;
    const startTime = performance.now();

    function animateSpin(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);

        wheelAngle = startAngle + totalSpin * ease;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            wheelSpinning = false;
            drawWheel(targetIndex);
            showResult(amount);
            isAnimating = false;
        }
    }

    requestAnimationFrame(animateSpin);
}

// ========================================
// Show Result (shared)
// ========================================
function showResult(amount) {
    const resultPanel = document.getElementById('resultPanel');
    const resultAmount = document.getElementById('resultAmount');
    const resultMessage = document.getElementById('resultMessage');
    const randomBtn = document.getElementById('randomBtn');

    resultAmount.textContent = formatCurrency(amount);
    resultMessage.textContent = MESSAGES[amount].text;
    resultPanel.classList.add('visible');
    resultPanel.style.display = 'block';

    isCelebrating = true;
    addToHistory(amount);

    // Reset button removed - game ends here
    // randomBtn.style.display = 'none'; // Optional: hide random button if you want to prevent clicking again immediately without reload, but requirement says "one time only", so maybe disable it.
    // Let's just hide the button as per previous logic, but NOT show reset button.
    randomBtn.style.display = 'none';

    if (amount >= 100000) {
        fireConfetti();
    }
    celebrateBurst();
    sendEmailNotification(amount);
}

// ========================================
// Reset (shared)
// ========================================
// Reset logic removed

// ========================================
// History (Tracking only)
// ========================================
function addToHistory(amount) {
    history.push(amount);
    // UI removed per request
}

// ========================================
// Email Notification via EmailJS
// ========================================
function sendEmailNotification(amount) {
    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        console.warn('[EmailJS] Chưa cấu hình! Vui lòng điền Public Key, Service ID, Template ID trong script.js');
        showToast('⚠️', 'Chưa cấu hình EmailJS. Xem hướng dẫn trong script.js', 'error');
        return;
    }

    if (typeof emailjs === 'undefined') {
        console.error('[EmailJS] SDK not loaded!');
        showToast('⚠️', 'Không tải được EmailJS. Kiểm tra kết nối mạng.', 'error');
        return;
    }

    showToast('📧', 'Đang gửi thông tin...', '');

    const now = new Date();
    const timeStr = now.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const total = history.reduce((sum, a) => sum + a, 0);

    // Template parameters — phải khớp với tên biến trong EmailJS Template
    const templateParams = {
        user_name: userData.name,
        bank_name: userData.bankName,
        bank_account: userData.bankAccount,
        amount: formatCurrency(amount),
        turn: history.length,
        total: formatCurrency(total),
        time: timeStr
    };

    console.log('[EmailJS] Sending email with params:', templateParams);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(response => {
            console.log('[EmailJS] SUCCESS:', response.status, response.text);
            showToast('✅', 'Đã gửi thông tin thành công!', 'success');
        })
        .catch(error => {
            console.error('[EmailJS] FAILED:', error);
            showToast('⚠️', 'Gửi thất bại: ' + (error.text || error.message || 'Lỗi không xác định'), 'error');
        });
}

// ========================================
// Toast Notification
// ========================================
function showToast(icon, message, type) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    toastIcon.textContent = icon;
    toastMessage.textContent = message;

    // Remove previous type classes
    toast.classList.remove('success', 'error', 'visible');

    if (type) {
        toast.classList.add(type);
    }

    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 4000);
}

// ========================================
// Confetti Effect
// ========================================
function resizeConfettiCanvas() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const confetti = [];
    const colors = ['#f1c40f', '#e74c3c', '#ff6b6b', '#ffd700', '#ff4757', '#ffa502', '#ff6348', '#eccc68'];

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.3,
            opacity: 1,
            decay: 0.01
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!isCelebrating) return;
        let active = false;

        for (const c of confetti) {
            if (c.opacity <= 0) continue;
            active = true;

            c.x += c.vx;
            c.vy += c.gravity;
            c.y += c.vy;
            c.rotation += c.rotationSpeed;
            c.opacity -= c.decay;
            c.vx *= 0.99;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, c.opacity);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();
        }

        if (active) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

function celebrateBurst() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const sparkles = [];
    const colors = ['#f1c40f', '#ffd700', '#ffa500'];

    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        sparkles.push({
            x: canvas.width / 2,
            y: canvas.height * 0.4,
            vx: Math.cos(angle) * (Math.random() * 5 + 2),
            vy: Math.sin(angle) * (Math.random() * 5 + 2),
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            decay: 0.02
        });
    }

    function animate() {
        if (!isCelebrating) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        let active = false;

        for (const s of sparkles) {
            if (s.opacity <= 0) continue;
            active = true;

            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.1;
            s.opacity -= s.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, s.opacity);
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (active) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}
