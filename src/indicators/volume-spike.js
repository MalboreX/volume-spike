const SimpleMovingAverage = require('./simple-moving-average');
const StandardDeviation = require('./standard-deviation');

function VolumeSpike(series, length, mult) {
    const basis = SimpleMovingAverage(series, length);
    const sd = StandardDeviation(series, length);

    return basis + mult * sd;
}

module.exports = VolumeSpike;