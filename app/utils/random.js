export const randomRange = (min, max) => Math.random() * (max - min) + min;

export const randomFloor = (min, max) => Math.floor(randomRange(min, max));

export const randomForBomb = (min, max) => randomFloor(min, max);

export const randomForColors = (min, max) => randomFloor(min, max);