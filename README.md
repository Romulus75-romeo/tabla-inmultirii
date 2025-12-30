# 🎮 Aventura Înmulțirii - Platformă Educațională

> Platformă interactivă pentru învățarea tablei înmulțirii, dedicată elevilor de clasa a 2-a!

![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?logo=javascript&logoColor=black)

## 🌟 Caracteristici

### 📚 Învățare Interactivă
- **10 Table de Înmulțire** (1-10) cu explicații vizuale
- **Reprezentări grafice** cu obiecte (mere, mingi, cadouri)
- **Mini-quiz-uri** pentru verificare
- **Progres salvat** automat

### 🎮 5 Jocuri Distractive
1. **🎯 Lovește Tabla Corectă** - Multiple choice cu feedback instant
2. **🏃 Cursă cu Numere** - Competiție animată cu bot
3. **🧩 Puzzle-ul Înmulțirii** - Deblochează piese cu răspunsuri corecte
4. **🎪 Circul Numerelor** - Grupare vizuală cu animăluțe
5. **🚀 Racheta Spațială** - Zbor spre lună cu fiecare succes

### 🏆 Sistem de Recompense
- **Stele** (1-3 per joc, bazat pe performanță)
- **Badge-uri** (pentru fiecare tablă învățată + realizări speciale)
- **Avatare personalizabile** (8 opțiuni: 🦝 🐰 🤖 🦊 🐻 🐼 🦁 🐯)
- **Certificat digital** la completarea tuturor tablelor

### ⚔️ Mod Duel
- Competiție 1-la-1 cu **Rică Ratonul** (botul)
- 3 nivele de dificultate: 🟢 Ușor | 🟡 Mediu | 🔴 Greu

### 👨‍👩‍👧 Dashboard Părinți
- Statistici complete de progres
- Recomandări automate
- Rapoarte printabile
- Opțiune resetare progres

## 🚀 Demo Live

**[Joacă Acum!](https://romulus75-romeo.github.io/tabla-inmultirii/)** *(după deployment)*

## 💻 Tehnologii

- **HTML5** - Structură semantică
- **CSS3** - Design modern + animații
- **Vanilla JavaScript** - Logică & interactivitate
- **localStorage** - Salvare progres local
- **Google Fonts** - Tipografie (Fredoka)

**Zero dependențe externe!** 🎉

## 📦 Instalare & Utilizare

### Opțiunea 1: Deschide Local
```bash
# Clonează repository-ul
git clone https://github.com/romulus75-romeo/tabla-inmultirii.git

# Navighează în folder
cd tabla-inmultirii

# Deschide index.html în browser
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

### Opțiunea 2: GitHub Pages
După ce faci push pe GitHub, activează Pages în Settings și accesează la:
```
https://[username].github.io/tabla-inmultirii/
```

## 📁 Structura Proiectului

```
tabla-inmultirii/
├── index.html                   # Pagina principală
├── styles.css                   # Design system
├── app.js                       # Core logic
├── learning.js                  # Modul învățare
├── game-multiple-choice.js      # Jocuri 1-5
├── game-race.js
├── game-puzzle.js
├── game-circus.js
├── game-rocket.js
├── duel.js                      # Mod duel
├── dashboard.js                 # Dashboard părinți
├── certificate-generator.js     # Generator certificate
├── rewards.js                   # Sistem recompense
├── robots.txt                   # SEO
├── sitemap.xml                  # SEO
└── assets/
    └── mascot.png               # Rică Ratonul
```

## 🎨 Design

- **Paleta de culori:** Vibrantă și prietenoasă pentru copii
- **Responsive:** Desktop, tabletă, telefon
- **Animații:** Smooth transitions & confetti
- **Accessibility:** Semantic HTML, bun contrast

## 🧠 Cum Funcționează

1. **Alege Avatar** - Personalizează experiența
2. **Învață** - Explorează tablele cu vizualizări grafice
3. **Joacă** - Exersează prin jocuri interactive
4. **Provoacă** - Dueluri cu bot-ul
5. **Obține Recompense** - Stele, badge-uri, certificat!

Progresul se salvează automat în browser (localStorage).

## 👥 Pentru Cine?

- ✅ **Elevi** clasa a 2-a (7-8 ani)
- ✅ **Părinți** care vor să ajute copiii să învețe
- ✅ **Profesori** pentru clasă sau teme
- ✅ **Școli** și after-school-uri

## 📊 Statistici Salvate

Platforma urmărește automat:
- Table învățate (1-10)
- Jocuri jucate
- Răspunsuri corecte/greșite
- Stele acumulate
- Badge-uri deblocate
- Data ultimei activități

## 🔒 Siguranță & Confidențialitate

- ✅ **100% offline-capable** (după încărcare inițială)
- ✅ **Fără reclame**
- ✅ **Fără link-uri externe**
- ✅ **Fără tracking**
- ✅ **Date salvate doar local** (nu se trimit pe server)

## 🛠️ Customizare

Poți modifica cu ușurință:
- **Culori:** Modifică variabilele CSS în `:root` (styles.css)
- **Mascotă:** Înlocuiește `assets/mascot.png`
- **Număr de întrebări:** Schimbă `totalQuestions` în fișierele game-*.js
- **Dificultate bot:** Ajustează `botSpeed` și `botAccuracy` în duel.js

## 🐛 Raportare Bug-uri

Găsești un bug? Deschide un [Issue](https://github.com/romulus75-romeo/tabla-inmultirii/issues)!

## 🤝 Contribuții

Contribuțiile sunt binevenite! 

1. Fork repository-ul
2. Creează un branch (`git checkout -b feature/ImbunatatireNoua`)
3. Commit schimbările (`git commit -m 'Adaugă funcționalitate X'`)
4. Push la branch (`git push origin feature/ImbunatatireNoua`)
5. Deschide un Pull Request

## 📝 Licență

Acest proiect este open-source și disponibil gratuit pentru uz educațional.

## 💡 Viitor

Idei pentru versiuni viitoare:
- [ ] Efecte sonore și narațiuni
- [ ] Mod multi-player local
- [ ] Teme sezoniere (Crăciun, Paști)
- [ ] Traducere în alte limbi
- [ ] Backend pentru statistici globale

## 🙏 Mulțumiri

- **Google Fonts** pentru tipografia Fredoka
- **Gemini AI** pentru generarea mascotei
- **Comunitatea educațională** pentru inspirație

---

**Dezvoltat cu ❤️ pentru copiii care învață tabla înmulțirii!**

*Dacă îți place proiectul, lasă o ⭐ pe GitHub!*
