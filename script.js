// ============================================
// TIKTOK DOWNLOADER - FULL SCRIPT
// CREATED BY LORD GPT FOR UCUP
// ============================================

// ========== PARTICLES ANIMATION ==========
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ========== NAVBAR SCROLL EFFECT ==========
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========== SMOOTH SCROLL ==========
function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========== STATS COUNTER ==========
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.getAttribute('data-target'));
                const duration = 2000;
                const step = targetNumber / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < targetNumber) {
                        target.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = targetNumber.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ========== FAQ ACCORDION ==========
function handleFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========== PASTE BUTTON ==========
function handlePaste() {
    const pasteBtn = document.getElementById('pasteBtn');
    const urlInput = document.getElementById('urlInput');
    
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            urlInput.value = text;
            
            // Visual feedback
            pasteBtn.style.color = '#00ff88';
            setTimeout(() => {
                pasteBtn.style.color = '';
            }, 1000);
        } catch (err) {
            alert('Gagal mengakses clipboard!');
        }
    });
}

// ========== EXAMPLE URLS ==========
function handleExampleUrls() {
    const exampleBtns = document.querySelectorAll('.example-btn');
    const urlInput = document.getElementById('urlInput');
    
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            urlInput.value = url;
            urlInput.focus();
        });
    });
}

// ========== DOWNLOAD FUNCTIONALITY ==========
async function handleDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('urlInput');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const resultCard = document.getElementById('resultCard');
    
    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        // Validate URL
        if (!url) {
            showNotification('Masukkan URL TikTok dulu!', 'error');
            urlInput.focus();
            return;
        }
        
        if (!url.includes('tiktok.com')) {
            showNotification('URL bukan dari TikTok!', 'error');
            return;
        }
        
        // Show loading
        downloadBtn.classList.add('loading');
        loadingOverlay.style.display = 'flex';
        resultCard.style.display = 'none';
        
        // Simulate loading steps
        simulateLoadingSteps();
        
        try {
            // Call API
            const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (data.success) {
                // Show result
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    downloadBtn.classList.remove('loading');
                    showResult(data);
                }, 2000);
                
                showNotification('Video berhasil ditemukan!', 'success');
            } else {
                throw new Error(data.message || 'Gagal download');
            }
        } catch (error) {
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                downloadBtn.classList.remove('loading');
                showNotification('Gagal mendownload video: ' + error.message, 'error');
            }, 2000);
        }
    });
}

// ========== SIMULATE LOADING STEPS ==========
function simulateLoadingSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep > 0) {
            steps[currentStep - 1].classList.remove('active');
            steps[currentStep - 1].classList.add('completed');
        }
        
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 800);
}

// ========== SHOW RESULT ==========
function showResult(data) {
    const resultCard = document.getElementById('resultCard');
    const videoPlayer = document.getElementById('videoPlayer');
    const authorName = document.getElementById('authorName');
    const viewCount = document.getElementById('viewCount');
    const likeCount = document.getElementById('likeCount');
    const duration = document.getElementById('duration');
    const downloadHD = document.getElementById('downloadHD');
    const downloadSD = document.getElementById('downloadSD');
    const downloadAudio = document.getElementById('downloadAudio');
    
    // Update video
    videoPlayer.src = data.videoUrl;
    
    // Update info
    authorName.textContent = data.author || 'Unknown';
    viewCount.textContent = formatNumber(data.views || 0);
    likeCount.textContent = formatNumber(data.likes || 0);
    duration.textContent = data.duration || '00:00';
    
    // Update download links
    downloadHD.href = data.videoUrl || '#';
    downloadSD.href = data.videoUrl || '#';
    downloadAudio.href = data.audioUrl || '#';
    
    // Show card
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== CLOSE RESULT ==========
function handleCloseResult() {
    const closeBtn = document.getElementById('closeResult');
    const resultCard = document.getElementById('resultCard');
    
    closeBtn.addEventListener('click', () => {
        resultCard.style.display = 'none';
        document.getElementById('videoPlayer').src = '';
    });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.9rem',
        fontWeight: '500'
    });
    
    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 136, 0.2)';
        notification.style.border = '1px solid rgba(0, 255, 136, 0.3)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 51, 51, 0.2)';
        notification.style.border = '1px solid rgba(255, 51, 51, 0.3)';
    } else {
        notification.style.background = 'rgba(255, 170, 0, 0.2)';
        notification.style.border = '1px solid rgba(255, 170, 0, 0.3)';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== FORMAT NUMBER ==========
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ========== ADD ANIMATION STYLES ==========
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleNavbarScroll();
    handleSmoothScroll();
    animateStats();
    handleFAQ();
    handlePaste();
    handleExampleUrls();
    handleDownload();
    handleCloseResult();
    addAnimationStyles();
    
    console.log('🔥 TikTok Downloader by LORD GPT for UCUP - READY! 🔥');
});