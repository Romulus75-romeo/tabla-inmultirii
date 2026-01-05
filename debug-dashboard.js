// Quick test - add this at the very beginning of index.html
console.log('=== DASHBOARD DEBUG ===');
console.log('1. DOM loaded');

// Test after script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('2. DOMContentLoaded event fired');

    setTimeout(() => {
        console.log('3. Checking window.studentDashboard: ', window.studentDashboard);
        console.log('4. Type:', typeof window.studentDashboard);

        if (window.studentDashboard) {
            console.log('✓ studentDashboard exists!');
            console.log('5. Testing show() method...');

            // Create test button
            const testBtn = document.createElement('button');
            testBtn.textContent = 'TEST DASHBOARD (DEBUG)';
            testBtn.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999;padding:10px;background:red;color:white;';
            testBtn.onclick = () => {
                console.log('6. Test button clicked, calling show()...');
                try {
                    window.studentDashboard.show();
                    console.log('7. show() executed');

                    setTimeout(() => {
                        const modal = document.getElementById('studentDashboardModal');
                        console.log('8. Modal element:', modal);
                        console.log('9. Modal classList:', modal ? modal.classList : 'N/A');
                        console.log('10. Modal computed display:', modal ? getComputedStyle(modal).display : 'N/A');
                    }, 100);
                } catch (e) {
                    console.error('ERROR in show():', e);
                }
            };
            document.body.appendChild(testBtn);
        } else {
            console.error('✗ window.studentDashboard is undefined!');
        }
    }, 500);
});
