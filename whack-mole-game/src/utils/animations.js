/**
 * Animation Utilities
 * CSS animations and transitions for game elements
 */

/**
 * Mole animation classes
 */
export const moleAnimations = {
  // Mole appearing
  appear: 'mole-appear',
  // Mole disappearing
  disappear: 'mole-disappear',
  // Mole being hit
  hit: 'mole-hit',
  // Mole idle animation
  idle: 'mole-idle'
};

/**
 * Puzzle piece animations
 */
export const puzzleAnimations = {
  // Piece falling
  fall: 'puzzle-fall',
  // Piece being picked up
  pickup: 'puzzle-pickup',
  // Piece being placed correctly
  place: 'puzzle-place',
  // Wrong placement
  wrong: 'puzzle-wrong'
};

/**
 * UI animations
 */
export const uiAnimations = {
  // Fade in
  fadeIn: 'fade-in',
  // Fade out
  fadeOut: 'fade-out',
  // Slide up
  slideUp: 'slide-up',
  // Slide down
  slideDown: 'slide-down',
  // Scale in
  scaleIn: 'scale-in',
  // Bounce
  bounce: 'bounce',
  // Shake
  shake: 'shake',
  // Pulse
  pulse: 'pulse'
};

/**
 * Create CSS animation keyframes dynamically
 */
export function createKeyframes(name, keyframes) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ${name} {
      ${Object.entries(keyframes).map(([percent, styles]) =>
        `${percent} { ${Object.entries(styles).map(([prop, val]) => `${prop}: ${val}`).join('; ')} }`
      ).join('\n')}
    }
  `;
  document.head.appendChild(style);
}

/**
 * Predefined keyframes
 */
export const predefinedKeyframes = {
  moleAppear: {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  moleDisappear: {
    '0%': { transform: 'translateY(0)', opacity: '1' },
    '100%': { transform: 'translateY(100%)', opacity: '0' }
  },
  moleHit: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.2) rotate(10deg)' },
    '100%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' }
  },
  puzzleFall: {
    '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '0' },
    '60%': { transform: 'translateY(10px) rotate(5deg)' },
    '80%': { transform: 'translateY(-5px) rotate(-3deg)' },
    '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' }
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' }
  },
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  slideDown: {
    '0%': { transform: 'translateY(-20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  scaleIn: {
    '0%': { transform: 'scale(0.8)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' }
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' }
  }
};

/**
 * Initialize all predefined keyframes
 */
export function initializeKeyframes() {
  Object.entries(predefinedKeyframes).forEach(([name, keyframes]) => {
    createKeyframes(name, keyframes);
  });
}

/**
 * Apply animation to element
 */
export function applyAnimation(element, animationName, duration = 300, easing = 'ease-in-out') {
  element.style.animation = `${animationName} ${duration}ms ${easing}`;
  return new Promise((resolve) => {
    element.addEventListener('animationend', () => {
      element.style.animation = '';
      resolve();
    }, { once: true });
  });
}

/**
 * Create particle effect
 */
export function createParticleEffect(x, y, color = '#ffd700', count = 10) {
  const particles = [];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `;

    const angle = (Math.PI * 2 * i) / count;
    const velocity = 50 + Math.random() * 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    document.body.appendChild(particle);

    particles.push({
      element: particle,
      x, y,
      vx, vy,
      opacity: 1
    });
  }

  return animateParticles(particles);
}

/**
 * Animate particles
 */
function animateParticles(particles) {
  return new Promise((resolve) => {
    let frame = 0;
    const maxFrames = 30;

    function animate() {
      frame++;

      particles.forEach(p => {
        p.x += p.vx / maxFrames;
        p.y += p.vy / maxFrames + 2; // Add gravity
        p.opacity -= 1 / maxFrames;

        p.element.style.transform = `translate(${p.x - p.vx / maxFrames}px, ${p.y - p.vy / maxFrames - 2}px)`;
        p.element.style.opacity = p.opacity;
      });

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(p => p.element.remove());
        resolve();
      }
    }

    animate();
  });
}

/**
 * Score popup animation
 */
export function showScorePopup(x, y, score, color = '#ffd700') {
  const popup = document.createElement('div');
  popup.textContent = `+${score}`;
  popup.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    color: ${color};
    font-size: 24px;
    font-weight: bold;
    pointer-events: none;
    z-index: 9999;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  `;

  document.body.appendChild(popup);

  return new Promise((resolve) => {
    let frame = 0;
    const maxFrames = 30;

    function animate() {
      frame++;
      popup.style.transform = `translateY(-${frame * 2}px)`;
      popup.style.opacity = 1 - frame / maxFrames;

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        popup.remove();
        resolve();
      }
    }

    animate();
  });
}

/**
 * Screen shake effect
 */
export function screenShake(intensity = 5, duration = 200) {
  const body = document.body;
  let frame = 0;
  const maxFrames = duration / 16;

  function animate() {
    frame++;
    const x = (Math.random() - 0.5) * intensity;
    const y = (Math.random() - 0.5) * intensity;
    body.style.transform = `translate(${x}px, ${y}px)`;

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      body.style.transform = '';
    }
  }

  animate();
}
