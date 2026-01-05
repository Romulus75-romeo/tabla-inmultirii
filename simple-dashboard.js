// ============================================
// SIMPLE Student Dashboard - Robust Version
// ============================================

function showStudentDashboard() {
    console.log('showStudentDashboard v2 called');

    // Get progress safely
    let progress;
    try {
        progress = JSON.parse(localStorage.getItem('multiplicationProgress')) || {};
    } catch (e) {
        progress = {};
    }

    // Defaults
    progress.learnedTables = progress.learnedTables || [];
    progress.badges = progress.badges || [];
    progress.totalStars = progress.totalStars || 0;
    progress.gamesPlayed = progress.gamesPlayed || 0;

    // Remove existing overlay if any
    const existing = document.getElementById('dashboardOverlay');
    if (existing) existing.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'dashboardOverlay';
    // FORCE styles using specific properties
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    overlay.style.zIndex = '2147483647'; // Max z-index
    overlay.style.display = 'block'; // Simple block

    const container = document.createElement('div');
    container.style.cssText = `
        position: relative !important;
        background-color: #ffffff !important;
        border-radius: 20px !important;
        padding: 20px !important;
        width: 90% !important;
        max-width: 600px !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        box-shadow: 0 0 50px rgba(0,0,0,0.8) !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        text-align: center !important;
        z-index: 2147483647 !important;
        margin: auto !important;
    `;

    // Stats calculation
    const learnedCount = progress.learnedTables.length;
    const progressPercent = Math.min(100, (learnedCount / 10) * 100);

    // HTML Content
    container.innerHTML = `
        <div style="text-align: right;">
            <button id="closeDashBtn" style="background:none; border:none; font-size: 30px; cursor:pointer;">❌</button>
        </div>
        
        <h1 style="color: #FF6B6B; margin-top: 0; font-size: 28px;">🎉 Tabloul Tău</h1>
        
        <div style="background: #4ECDC4; color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
            <h2 style="margin:0; font-size: 40px;">${learnedCount} / 10</h2>
            <p style="margin:5px 0 0 0;">Table Învățate</p>
            <div style="background: rgba(255,255,255,0.4); height: 15px; border-radius: 10px; margin-top: 10px; overflow: hidden;">
                <div style="background: white; height: 100%; width: ${progressPercent}%;"></div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
            <div style="flex: 1; margin: 0 5px; background: #FFE66D; padding: 10px; border-radius: 10px;">
                <div style="font-size: 24px;">⭐</div>
                <div style="font-weight:bold; font-size: 20px;">${progress.totalStars}</div>
                <div style="font-size: 12px;">Stele</div>
            </div>
            <div style="flex: 1; margin: 0 5px; background: #FF6B6B; color: white; padding: 10px; border-radius: 10px;">
                <div style="font-size: 24px;">🏅</div>
                <div style="font-weight:bold; font-size: 20px;">${progress.badges.length}</div>
                <div style="font-size: 12px;">Badge-uri</div>
            </div>
            <div style="flex: 1; margin: 0 5px; background: #95E1D3; padding: 10px; border-radius: 10px;">
                <div style="font-size: 24px;">🎮</div>
                <div style="font-weight:bold; font-size: 20px;">${progress.gamesPlayed}</div>
                <div style="font-size: 12px;">Jocuri</div>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <button id="goLearnBtn" style="background: #FF6B6B; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer; margin-bottom: 10px; width: 100%;">
                🚀 Hai să Învățăm!
            </button>
            <button id="goPlayBtn" style="background: #4ECDC4; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer; width: 100%;">
                🎮 Hai să Jucăm!
            </button>
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Add Event Listeners
    document.getElementById('closeDashBtn').onclick = () => overlay.remove();

    document.getElementById('goLearnBtn').onclick = () => {
        overlay.remove();
        if (typeof showTab === 'function') showTab('learn');
    };

    document.getElementById('goPlayBtn').onclick = () => {
        overlay.remove();
        if (typeof showTab === 'function') showTab('games');
    };
}

// Ensure it's global
window.showStudentDashboard = showStudentDashboard;
