class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        // Set initial theme based on document class
        this.currentTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
        this.updateColors();
        
        this.init();
        this.animate();
        this.bindEvents();
        
        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateColors();
        });
    }
    
    init() {
        this.resizeCanvas();
        
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        };
    }
    
    updateColors() {
        if (this.currentTheme === 'light') {
            // Light theme colors (more subtle)
            this.colors = [
                'rgba(0, 102, 204, 0.4)',    // Darker blue
                'rgba(138, 43, 226, 0.4)',   // Darker purple
                'rgba(0, 170, 85, 0.4)'      // Darker green
            ];
        } else {
            // Dark theme colors (more vibrant)
            this.colors = [
                'rgba(0, 217, 255, 0.8)',
                'rgba(138, 43, 226, 0.8)',
                'rgba(0, 255, 170, 0.8)'
            ];
        }
        
        // Update existing particles
        this.particles.forEach(particle => {
            particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, particle.size,
            particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    drawLine(p1, p2) {
        const distance = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + 
            Math.pow(p2.y - p1.y, 2)
        );
        
        if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            
            // Adjust opacity based on theme
            const baseOpacity = this.currentTheme === 'light' ? 0.05 : 0.2;
            const opacity = baseOpacity * (1 - distance / 100);
            
            // Adjust color based on theme
            const lineColor = this.currentTheme === 'light' 
                ? `rgba(0, 102, 204, ${opacity})`
                : `rgba(0, 217, 255, ${opacity})`;
            
            this.ctx.strokeStyle = lineColor;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        }
    }
    
    updateParticle(particle) {
        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            particle.x -= Math.cos(angle) * force * 5;
            particle.y -= Math.sin(angle) * force * 5;
        }
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls
        if (particle.x > this.canvas.width || particle.x < 0) {
            particle.speedX = -particle.speedX;
        }
        if (particle.y > this.canvas.height || particle.y < 0) {
            particle.speedY = -particle.speedY;
        }
        
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    }
    
    animate() {
        // Clear canvas with theme-appropriate background
        const clearColor = this.currentTheme === 'light' 
            ? 'rgba(248, 249, 250, 0.05)'
            : 'rgba(10, 10, 15, 0.05)';
        
        this.ctx.fillStyle = clearColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Draw connections between particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.drawLine(this.particles[i], this.particles[j]);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Add new particles on fast mouse movement
            if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5) {
                this.particles.push(this.createParticle(e.clientX, e.clientY));
                
                // Limit total particles
                if (this.particles.length > 100) {
                    this.particles.shift();
                }
            }
        });
        
        window.addEventListener('click', (e) => {
            // Add burst of particles on click
            for (let i = 0; i < 5; i++) {
                this.particles.push(this.createParticle(e.clientX, e.clientY));
            }
        });
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});