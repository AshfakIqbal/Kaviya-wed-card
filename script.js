document.addEventListener('DOMContentLoaded', () => {
    const envelopeBtn = document.getElementById('envelope-button');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');

    // ==========================================
    // Particle Rain Generator (Petals & Rings)
    // ==========================================
    const createParticle = (type) => {
        const particle = document.createElement('div');
        particle.classList.add('falling-particle');
        particle.classList.add(type);
        
        // Random horizontal starting position (0 to 100vw)
        particle.style.left = Math.random() * 100 + 'vw';
        
        // Random animation duration for varied speeds
        const duration = Math.random() * 6 + 7; // 7 to 13 seconds
        particle.style.animationDuration = duration + 's';
        
        // Size assignment based on particle type
        if (type === 'petal') {
            const size = Math.random() * 12 + 15; // 15px to 27px
            particle.style.width = size + 'px';
            particle.style.height = (size * 1.3) + 'px';
        } else if (type === 'ring') {
            const size = Math.random() * 10 + 20; // 20px to 30px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
        }

        // Add interactive 'move away' effect for petals
        if (type === 'petal') {
            particle.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent underlying elements from triggering
                
                // Calculate random trajectory out of the screen
                const angle = Math.random() * Math.PI * 2;
                const distance = 400; // pixels to jump away
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                // Replace CSS animation with an inline transition for realistic push-back
                particle.style.animation = 'none';
                particle.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
                particle.style.transform = `translate(${tx}px, ${ty}px) rotate(360deg) scale(0.3)`;
                particle.style.opacity = '0';
                
                // Cleanup instantly after interaction completes
                setTimeout(() => { if (particle.parentNode) particle.parentNode.removeChild(particle); }, 600);
            }, { once: true });
        }

        document.body.appendChild(particle);

        // Remove from DOM safely after the animation ends to avoid memory leaks
        setTimeout(() => {
            if(document.body.contains(particle)) {
                particle.remove();
            }
        }, (duration + 1) * 1000);
    };

    let particlesStarted = false;
    const startParticles = () => {
        if(particlesStarted) return;
        particlesStarted = true;
        
        // Pre-fill initial batch randomly so they don't all start at once
        for(let i=0; i<15; i++) {
            setTimeout(() => {
                createParticle('petal');
                if(Math.random() > 0.6) createParticle('ring'); // 40% chance of ring
            }, Math.random() * 3000);
        }
        
        // Setup continuous rain loop
        setInterval(() => {
            createParticle('petal');
            if(Math.random() > 0.7) createParticle('ring'); // 30% chance of ring for balanced density
        }, 500); 
    };

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
                
                // Start raining effect as soon as main content is visible
                startParticles();
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
