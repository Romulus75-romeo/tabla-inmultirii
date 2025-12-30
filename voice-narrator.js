// ============================================
// Voice Narrator - Text-to-Speech pentru Copii
// ============================================

class VoiceNarrator {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.isEnabled = localStorage.getItem('voiceEnabled') !== 'false';
        this.voice = null;
        this.volume = parseFloat(localStorage.getItem('voiceVolume')) || 0.8;
        this.rate = 0.9; // Puțin mai încet pentru copii
        this.pitch = 1.2; // Puțin mai înalt pentru voce prietenoasă

        this.initVoice();
        this.createControls();
    }

    initVoice() {
        // Așteaptă să se încarce vocile
        const setVoice = () => {
            const voices = this.synthesis.getVoices();

            // Încearcă să găsească o voce feminină în română
            this.voice = voices.find(v =>
                v.lang.startsWith('ro') && v.name.toLowerCase().includes('female')
            ) || voices.find(v =>
                v.lang.startsWith('ro')
            ) || voices.find(v =>
                v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('female')
            ) || voices[0];

            console.log('Voce selectată:', this.voice?.name);
        };

        if (this.synthesis.getVoices().length > 0) {
            setVoice();
        } else {
            this.synthesis.onvoiceschanged = setVoice;
        }
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'voice-controls';
        controls.innerHTML = `
            <button class="voice-toggle ${this.isEnabled ? 'active' : ''}" id="voiceToggle" title="Activează/Dezactivează vocea">
                <span class="voice-icon">${this.isEnabled ? '🔊' : '🔇'}</span>
            </button>
            <div class="voice-settings ${this.isEnabled ? 'visible' : ''}" id="voiceSettings">
                <label>Volum: <span id="volumeValue">${Math.round(this.volume * 100)}%</span></label>
                <input type="range" id="volumeSlider" min="0" max="100" value="${this.volume * 100}">
            </div>
        `;

        document.body.appendChild(controls);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('voiceToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        const settings = document.getElementById('voiceSettings');

        toggleBtn.addEventListener('click', () => {
            this.isEnabled = !this.isEnabled;
            localStorage.setItem('voiceEnabled', this.isEnabled);

            toggleBtn.classList.toggle('active');
            toggleBtn.querySelector('.voice-icon').textContent = this.isEnabled ? '🔊' : '🔇';
            settings.classList.toggle('visible');

            if (this.isEnabled) {
                this.speak('Vocea este activată! Bine ai venit!');
            } else {
                this.synthesis.cancel();
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            localStorage.setItem('voiceVolume', this.volume);
            volumeValue.textContent = Math.round(this.volume * 100) + '%';
        });
    }

    speak(text, priority = 'normal') {
        if (!this.isEnabled || !text) return;

        // Anulează vorbirea anterioară dacă este prioritate înaltă
        if (priority === 'high') {
            this.synthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.volume = this.volume;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.lang = 'ro-RO';

        this.synthesis.speak(utterance);
    }

    speakQuestion(num1, num2) {
        this.speak(`Cât face ${num1} înmulțit cu ${num2}?`, 'high');
    }

    speakCorrect() {
        const messages = [
            'Bravo! Foarte bine!',
            'Corect! Ești fantastic!',
            'Excelent! Continuă așa!',
            'Perfect! Ai răspuns corect!',
            'Super! Ai dreptate!'
        ];
        this.speak(messages[Math.floor(Math.random() * messages.length)]);
    }

    speakWrong(correctAnswer) {
        this.speak(`Hmm, nu e corect. Răspunsul este ${correctAnswer}. Încearcă din nou!`);
    }

    speakWelcome() {
        this.speak('Bine ai venit la Aventura Înmulțirii! Sunt Rică Ratonul, ghidul tău! Hai să învățăm tabla înmulțirii împreună!');
    }

    speakTableIntro(tableNumber) {
        // Explicație detaliată pentru fiecare tablă
        const intro = `Bine ai venit! Astăzi vom învăța tabla lui ${tableNumber}. `;
        const explanation = `Ce înseamnă înmulțirea cu ${tableNumber}? Înseamnă că vom aduna numărul ${tableNumber} de mai multe ori. `;
        const example = `De exemplu, ${tableNumber} înmulțit cu 3, se scrie ${tableNumber} ori 3, și înseamnă ${tableNumber} plus ${tableNumber} plus ${tableNumber}, ceea ce face ${tableNumber * 3}. `;
        const encouragement = `Este foarte simplu! Hai să vedem toate exemplele împreună!`;

        this.speak(intro + explanation + example + encouragement);
    }

    speakTableRow(tableNumber, multiplier, result) {
        const text = `${tableNumber} înmulțit cu ${multiplier} face ${result}. Aceasta înseamnă ${multiplier} grupe cu câte ${tableNumber} obiecte.`;
        this.speak(text);
    }

    speakTableComplete(tableNumber) {
        this.speak(`Bravo! Ai terminat de învățat tabla lui ${tableNumber}! Acum știi toate înmulțirile cu ${tableNumber}. Ești grozav!`);
    }

    speakGameStart(gameName) {
        const intros = {
            'multiple-choice': 'Hai să jucăm Lovește Tabla Corectă! Alege răspunsul corect!',
            'race': 'Cursă cu Numere! Răspunde repede și vei alerga mai rapid!',
            'puzzle': 'Puzzle-ul Înmulțirii! Rezolvă problemele pentru a debloca piesele!',
            'circus': 'Bine ai venit la Circul Numerelor! Numără animalele!',
            'rocket': 'Racheta Spațială! Fiecare răspuns corect te ridică mai sus!'
        };
        this.speak(intros[gameName] || 'Hai să jucăm!');
    }

    speakGameEnd(correct, total) {
        const percentage = (correct / total) * 100;
        let message = '';

        if (percentage === 100) {
            message = `Perfect! Ai răspuns corect la toate cele ${total} întrebări! Ești un campion!`;
        } else if (percentage >= 80) {
            message = `Foarte bine! Ai răspuns corect la ${correct} din ${total} întrebări!`;
        } else if (percentage >= 60) {
            message = `Bine lucrat! Ai ${correct} răspunsuri corecte din ${total}. Continuă să exersezi!`;
        } else {
            message = `Hai să mai exersăm! Ai ${correct} răspunsuri corecte. Nu renunța!`;
        }

        this.speak(message);
    }

    speakBadgeUnlocked(badgeName) {
        this.speak(`Felicitări! Ai deblocat badge-ul ${badgeName}!`);
    }

    speakCertificate() {
        this.speak('Uau! Ai terminat toate tablele! Felicitări pentru certificatul tău! Ești un adevărat expert!');
    }

    stop() {
        this.synthesis.cancel();
    }
}

// Inițializează naratorul
window.narrator = null;
document.addEventListener('DOMContentLoaded', () => {
    window.narrator = new VoiceNarrator();

    // Salut de bun venit după 1 secundă
    setTimeout(() => {
        if (window.narrator && window.narrator.isEnabled) {
            window.narrator.speakWelcome();
        }
    }, 1000);
});

// CSS pentru controale
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    .voice-controls {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 999;
        background: var(--white);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        padding: 1rem;
    }

    .voice-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--info), var(--info-dark));
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-md);
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .voice-toggle:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-lg);
    }

    .voice-toggle:not(.active) {
        background: var(--gray-300);
        opacity: 0.7;
    }

    .voice-settings {
        margin-top: 1rem;
        display: none;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .voice-settings.visible {
        display: block;
        opacity: 1;
    }

    .voice-settings label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--gray-700);
    }

    .voice-settings input[type="range"] {
        width: 150px;
        cursor: pointer;
    }

    #volumeValue {
        color: var(--primary);
        margin-left: 0.5rem;
    }

    @media (max-width: 768px) {
        .voice-controls {
            top: auto;
            bottom: 80px;
            right: 10px;
            padding: 0.75rem;
        }

        .voice-toggle {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
        }

        .voice-settings input[type="range"] {
            width: 120px;
        }
    }
`;
document.head.appendChild(voiceStyles);
