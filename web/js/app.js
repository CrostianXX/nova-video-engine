/* ============================================================
   NOVA — Main App Initialization
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Sidebar.init();
    Home.init();
    Chat.init();
    ImageEditor.init();
    I2V.init();
    Settings.init();

    console.log('%c✦ NOVA AI Creative Studio', 'color:#60a5fa;font-size:16px;font-weight:bold;');
    console.log('%c  Your AI Creative Partner', 'color:#94a3b8;font-size:12px;');
});
