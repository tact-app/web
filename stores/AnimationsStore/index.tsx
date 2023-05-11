import { makeObservable, observable, action } from 'mobx';
import confetti from 'canvas-confetti';

class AnimationsStoreClass {
  confettiDefaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0
  };

  constructor() {
    makeObservable(this, {
      confettiDefaults: observable,
      randomInRange: action.bound,
      displayFireworks: action.bound,
    });
  }

  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  };

  displayFireworks = (durationMs: number = 4000) => {
    const animationEnd = Date.now() + durationMs;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / durationMs);

      confetti({
        ...this.confettiDefaults,
        particleCount,
        origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });

      confetti({
        ...this.confettiDefaults,
        particleCount,
        origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };
}

export const AnimationsStore = new AnimationsStoreClass();
