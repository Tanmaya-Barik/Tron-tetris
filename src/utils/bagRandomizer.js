export const SHAPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export const generateBag = () => {
  const bag = [...SHAPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

export const getNextPieces = (queue, count = 5) => {
  let currentQueue = [...queue];
  while (currentQueue.length < count) {
    currentQueue = [...currentQueue, ...generateBag()];
  }
  return currentQueue;
};
