import raf from 'raf';

export default (time, cb) => {
  let rafId;
  const date = new Date(time);

  const countdown = () => {
    if (date - new Date() <= 0) {
      raf.cancel(rafId);
      cb();
      return;
    }

    rafId = raf(countdown);
  };

  countdown();

  return () => raf.cancel(rafId);
};
