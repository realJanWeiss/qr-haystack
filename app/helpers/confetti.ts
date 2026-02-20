import confetti from 'canvas-confetti';

export const confetti_hay = () => {
  confetti({
    shapes: [confetti.shapeFromText({ text: '🌾', scalar: 2 })],
    scalar: 4,
    colors: ['#b2a600', '#706901'],
    startVelocity: 30,
    gravity: 0.4,
    ticks: 300,
    particleCount: 100,
    spread: 90,
    origin: { y: 0.6 }
  });
};

/**
 * https://www.kirilv.com/canvas-confetti/#fireworks
 */
export const confetti_firework = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    scalar: 4
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};
