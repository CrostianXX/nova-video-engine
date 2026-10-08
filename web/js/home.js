/* ============================================================
   NOVA — Home Page
   ============================================================ */

const Home = {
    init() {
        this.updateGreeting();
    },

    updateGreeting() {
        const greetingEl = document.getElementById('greetingText');
        if (greetingEl) {
            const userName = Utils.storage.get('userName', 'Daniel');
            greetingEl.textContent = `${Utils.getGreeting()}, ${userName}.`;
        }
    }
};
