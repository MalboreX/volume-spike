function CandlestickArrayToVolumes(candlestickArray) {
    return candlestickArray.map(candle => Number(candle.volume));
}

module.exports = CandlestickArrayToVolumes;