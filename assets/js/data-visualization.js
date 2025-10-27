/**
 * Data Visualization for SHIONOGI Data Science Banner
 * 
 * Copyright (c) 2025 SHIONOGI & Co., Ltd.
 * All rights reserved.
 * 
 * PC only - disabled on mobile for cleaner design
 */

class DataVisualization {
    constructor(canvasId) {
        console.log('DataVisualization: Starting initialization...');
        
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with id "${canvasId}" not found`);
            return;
        }
        
        // モバイルではアニメーションを無効化
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            console.log('Mobile device detected - animation disabled for performance');
            this.canvas.style.display = 'none';
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.animationId = null;
        this.time = 0;
        
        // Colors inspired by SHIONOGI brand
        this.colors = {
            primary: '#E50112',
            secondary: '#0068B7',
            tertiary: '#00A95F',
            accent: '#1a1a1a',
            light: 'rgba(26, 26, 26, 0.3)'
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing data visualization (PC only)...');
        this.resize();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
        
        console.log('DataVisualization initialized with', this.particles.length, 'particles');
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width > 0 ? rect.width : 600;
        this.canvas.height = rect.height > 0 ? rect.height : 600;
        
        console.log('Canvas resized to:', this.canvas.width, 'x', this.canvas.height);
        
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // PC用のグリッド設定
        const gridSpacingX = 60;
        const gridSpacingY = 55;
        
        const cols = Math.floor(width / gridSpacingX);
        const rows = Math.floor(height / gridSpacingY);
        const particleCount = cols * rows;
        
        console.log(`Creating ${particleCount} particles (${cols} x ${rows} grid)`);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.particles.push({
                    x: (col + 0.5) * (width / cols),
                    y: (row + 0.5) * (height / rows),
                    baseX: (col + 0.5) * (width / cols),
                    baseY: (row + 0.5) * (height / rows),
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    radius: 1.5 + Math.random() * 1,
                    opacity: 0.3 + Math.random() * 0.4,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 0.5
                });
            }
        }
    }
    
    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // リサイズ時にモバイルになったら無効化
                const nowMobile = window.innerWidth <= 768;
                if (nowMobile && !this.isMobile) {
                    console.log('Switched to mobile - disabling animation');
                    this.destroy();
                    this.canvas.style.display = 'none';
                    this.isMobile = true;
                } else if (!nowMobile && this.isMobile) {
                    console.log('Switched to desktop - enabling animation');
                    this.canvas.style.display = 'block';
                    this.isMobile = false;
                    this.init();
                } else if (!this.isMobile) {
                    this.resize();
                }
            }, 200);
        });
    }
    
    updateParticles() {
        this.time += 0.01;
        
        this.particles.forEach((particle, i) => {
            const waveX = Math.sin(this.time + particle.phase) * 3;
            const waveY = Math.cos(this.time + particle.phase) * 3;
            
            particle.x = particle.baseX + waveX;
            particle.y = particle.baseY + waveY;
            
            particle.opacity = 0.3 + Math.sin(this.time * particle.speed + particle.phase) * 0.3;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(26, 26, 26, ${particle.opacity})`;
            this.ctx.fill();
            
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = `rgba(229, 1, 18, ${particle.opacity * 0.5})`;
            this.ctx.fill();
            
            this.ctx.restore();
        });
        
        this.drawDataFlow();
    }
    
    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.15;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(229, 1, 18, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawDataFlow() {
        const flowCount = 3;
        
        for (let i = 0; i < flowCount; i++) {
            const progress = (this.time * 0.5 + i * 0.33) % 1;
            const x = progress * this.canvas.width;
            const y = this.canvas.height * (0.2 + i * 0.3);
            
            this.ctx.save();
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 20);
            gradient.addColorStop(0, `rgba(229, 1, 18, 0.6)`);
            gradient.addColorStop(1, `rgba(229, 1, 18, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing DataVisualization...');
    
    setTimeout(() => {
        const visualization = new DataVisualization('dataVisualizationCanvas');
    }, 100);
});