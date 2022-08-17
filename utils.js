export const degreesToRadians = (angleInDegrees) => {
  return (Math.PI * angleInDegrees) / 180;
};

export const getFactorsOfTwo = (num) => {
  let array = [2];
  let x = 0;
  while (array[x] <= num) {
    x++;
    array.push(Math.pow(2, x+1));
  }

  return array;
};

export const randomNumberGenerator = (seed) => {
	if (seed === undefined) seed = performance.now();

	return function() {
    seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	}
}
