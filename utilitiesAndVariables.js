/**
 * returns an interger between min and max
 *
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomBoolean() {
  return Math.random() >= 0.5;
}

function tryProbability(probabilityPercentage) {
  let probability = randomFloat(0, 100);
  if (probability < probabilityPercentage) return true;
  else return false;
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-4.9 * value));
}

function activate(value) {
  return this.sigmoid(value);
}
