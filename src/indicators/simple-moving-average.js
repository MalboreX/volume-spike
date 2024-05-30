function SimpleMovingAverage(series, length) {
    let sum = 0;

    for (let i = 0; i < length; i++) {
        sum += series[series.length - 1 - i];
    }

    return sum / length;
}

module.exports = SimpleMovingAverage;