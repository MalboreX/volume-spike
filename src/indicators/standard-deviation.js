function StandardDeviation(series, length) {
    series = series.slice(-length);

    const mean = series.reduce((acc, val) => acc + val, 0) / length;

    const squaredDifferencesSum = series.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);

    const variance = squaredDifferencesSum / length;

    const standardDeviation = Math.sqrt(variance);

    return standardDeviation;
}

module.exports = StandardDeviation;