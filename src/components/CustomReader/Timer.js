export default class Timer {
    constructor(callback, interval) {
      this.callback = callback;
      this.interval = interval;
      this.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      this.animationFrame = null;
      this.timer = null;
      this.previous = null;
    }
  
    start() {
      this.stop();
      if (this.requestAnimationFrame) {
        this.previous = performance.now();
        this.requestAnimationFrame.call(window, this.step.bind(this));
      } else {
        this.previous = new Date().getTime();
        this.timer = setInterval(this.step.bind(this), 1);
      }
    }
  
    stop() {
      if (this.animationFrame) {
        window.cancelAnimationFrame(this.animationFrame);
        delete this.animationFrame;
      } else {
        clearInterval(this.timer);
        delete this.timer;
      }
    }
  
    step() {
      const current = this.requestAnimationFrame
        ? performance.now()
        : new Date().getTime();
  
      const delta = current - this.previous;
      if (delta >= this.interval) {
        this.previous = this.previous + this.interval;
        this.callback(current);
      }
      if (this.requestAnimationFrame) {
        this.animationFrame = this.requestAnimationFrame.call(
          window,
          this.step.bind(this)
        );
      }
    }
  }
  