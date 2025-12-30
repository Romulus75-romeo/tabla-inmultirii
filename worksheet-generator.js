// ============================================
// Worksheet Generator - Fișe de Lucru Printabile
// ============================================

class WorksheetGenerator {
    constructor() {
        this.worksheetTypes = {
            practice: 'Exersare',
            test: 'Evaluare',
            mixed: 'Amestec'
        };
    }

    generateWorksheet(tableNumber, type = 'practice', withAnswers = false) {
        const exercises = this.generateExercises(tableNumber, type);
        const html = this.createWorksheetHTML(tableNumber, type, exercises, withAnswers);
        return html;
    }

    generateExercises(tableNumber, type) {
        const exercises = [];

        if (type === 'practice') {
            // Toate calculele din tablă în ordine
            for (let i = 1; i <= 10; i++) {
                exercises.push({
                    num1: tableNumber,
                    num2: i,
                    answer: tableNumber * i
                });
            }
        } else if (type === 'test') {
            // Random din tablă, 20 de exerciții
            for (let i = 0; i < 20; i++) {
                const num2 = Math.floor(Math.random() * 10) + 1;
                exercises.push({
                    num1: tableNumber,
                    num2: num2,
                    answer: tableNumber * num2
                });
            }
        } else if (type === 'mixed') {
            // Mixed cu alte table învățate
            for (let i = 0; i < 20; i++) {
                const randomTable = Math.floor(Math.random() * tableNumber) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                exercises.push({
                    num1: randomTable,
                    num2: num2,
                    answer: randomTable * num2
                });
            }
        }

        return exercises;
    }

    createWorksheetHTML(tableNumber, type, exercises, withAnswers) {
        const typeName = this.worksheetTypes[type];
        const date = new Date().toLocaleDateString('ro-RO');

        return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fișă de Lucru - Tabla lui ${tableNumber}</title>
    <style>
        @media print {
            @page { margin: 1cm; }
            body { margin: 0; }
            .no-print { display: none !important; }
        }
        
        body {
            font-family: 'Arial', sans-serif;
            max-width: 21cm;
            margin: 0 auto;
            padding: 1cm;
            background: white;
        }
        
        .worksheet-header {
            text-align: center;
            border-bottom: 3px solid #FF6B6B;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        
        .worksheet-title {
            font-size: 2rem;
            color: #FF6B6B;
            margin: 0;
            font-weight: bold;
        }
        
        .worksheet-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin: 0.5rem 0;
        }
        
        .worksheet-info {
            display: flex;
            justify-content: space-between;
            margin: 1rem 0;
            padding: 0.5rem;
            background: #f0f0f0;
            border-radius: 8px;
        }
        
        .exercises-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .exercise {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
        }
        
        .exercise-number {
            background: #4ECDC4;
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .exercise-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .number {
            color: #FF6B6B;
        }
        
        .operator {
            color: #4ECDC4;
        }
        
        .answer-box {
            width: 60px;
            height: 40px;
            border: 2px solid #4ECDC4;
            border-radius: 5px;
            text-align: center;
            font-size: 1.3rem;
            font-weight: bold;
            ${withAnswers ? 'background: #95E1D3; color: #000;' : 'background: white;'}
        }
        
        .worksheet-footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid #FF6B6B;
            text-align: center;
            color: #666;
        }
        
        .mascot {
            text-align: center;
            margin: 2rem 0;
            font-size: 3rem;
        }
        
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: #4ECDC4;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .print-btn:hover {
            background: #2AB7AE;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ Printează</button>
    
    <div class="worksheet-header">
        <h1 class="worksheet-title">📝 Fișă de Lucru ${withAnswers ? '(cu Răspunsuri)' : ''}</h1>
        <p class="worksheet-subtitle">Tabla înmulțirii cu ${tableNumber} - ${typeName}</p>
    </div>
    
    <div class="worksheet-info">
        <div><strong>Nume și Prenume:</strong> _______________________</div>
        <div><strong>Data:</strong> ${date}</div>
    </div>
    
    <div class="mascot">🦝</div>
    
    <div class="exercises-grid">
        ${exercises.map((ex, index) => `
            <div class="exercise">
                <div class="exercise-number">${index + 1}</div>
                <div class="exercise-content">
                    <span class="number">${ex.num1}</span>
                    <span class="operator">×</span>
                    <span class="number">${ex.num2}</span>
                    <span>=</span>
                    <div class="answer-box">${withAnswers ? ex.answer : ''}</div>
                </div>
            </div>
        `).join('')}
    </div>
    
    <div class="worksheet-footer">
        <p><strong>Bravo! Continuă să exersezi! 🌟</strong></p>
        <p style="font-size: 0.9rem;">Platformă educațională dezvoltată de Prof.Ing. Popescu Romulus</p>
    </div>
</body>
</html>
        `;
    }

    downloadWorksheet(tableNumber, type, withAnswers) {
        const html = this.generateWorksheet(tableNumber, type, withAnswers);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Fisa-Tabla-${tableNumber}-${type}${withAnswers ? '-RASPUNSURI' : ''}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    printWorksheet(tableNumber, type, withAnswers) {
        const html = this.generateWorksheet(tableNumber, type, withAnswers);
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        // Auto-print after load
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}

// Initialize
window.worksheetGenerator = new WorksheetGenerator();
