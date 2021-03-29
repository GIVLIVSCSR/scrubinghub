const makeIntervalArray = (items, startPoint, boundPoint) => {
  if (startPoint > boundPoint) {
    return items;
  }
  
  return makeIntervalArray([...items, startPoint], startPoint + 1, boundPoint);
};

const pickRundomPosition = (num) => {
  return Math.floor(Math.random() * Math.floor(num));
};

export const randomRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

const removeIntervalFromArray = (items, startPoint, boundPoint) => {
  if (startPoint > boundPoint) {
    return items;
  }

  const newArr = items.filter(item => item !== startPoint);  
  return removeIntervalFromArray(newArr, startPoint + 1, boundPoint);
};

const reducer = (items, positions) => {
  return items.reduce((accumulator, [ start, end ]) => {
    return removeIntervalFromArray(accumulator, start, end)
  }, positions);
};

export const getUniquePosition = (bombs) => {
  const refreshTopPosition = randomRange(48, 215);

  if (bombs.length === 0) {
    const refreshLeftPosition = randomRange(278, 1000);
    return { top: refreshTopPosition, left: refreshLeftPosition };
  }

  const leftPositionsToRemove = bombs.map(bomb => [ bomb.left - bomb.width, bomb.left + bomb.width ]);
  const allowedLeftPositions = makeIntervalArray([], 150, 1300);
  
  const freeLeftPositions = reducer(leftPositionsToRemove, allowedLeftPositions);
  const chooseLeft = randomRange(pickRundomPosition(freeLeftPositions.length), freeLeftPositions.length && freeLeftPositions.length < 900);

  const refreshLeftPosition = freeLeftPositions[chooseLeft];

  return { top: refreshTopPosition, left: refreshLeftPosition };
};