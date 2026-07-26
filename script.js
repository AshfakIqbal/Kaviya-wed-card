document.addEventListener('DOMContentLoaded', () => {
    const envelopeBtn = document.getElementById('envelope-button');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');

    // Handle Envelope Click
    envelopeBtn.addEventListener('click', () => {
        // Play audio
        bgMusic.play().catch(error => {
            console.log("Autoplay was prevented by the browser. User needs to interact first.", error);
        });
        musicToggleBtn.innerHTML = '🔊 Pause';

        // Animate Envelope opening
        document.querySelector('.envelope-flap').style.transform = 'rotateX(180deg)';
        document.querySelector('.envelope-flap').style.zIndex = '0';

        setTimeout(() => {
            // Hide envelope screen
            envelopeScreen.classList.add('hidden');
            
            // Show main content
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
                mainContent.classList.add('visible');
            }, 1000); // match CSS transition duration
        }, 800);
    });

    // Handle Music Toggle
    musicToggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggleBtn.innerHTML = '🔊 Pause';
        } else {
            bgMusic.pause();
            musicToggleBtn.innerHTML = '🔇 Play';
        }
    });

    // Countdown Logic (Target: Aug 19, 2026, 10:30 AM)
    const targetDate = new Date('August 19, 2026 10:30:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = "<h3 style='font-family: Playfair Display; color: #a87b32;'>The Ceremony Has Begun!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // initial call
});
