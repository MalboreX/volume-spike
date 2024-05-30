function CandlestickArrayToClosePrices(candlestickArray) {
    return candlestickArray.map(candle => Number(candle.close));
}

module.exports = CandlestickArrayToClosePrices;