class DataFeedCore {
    Candles = new Map();

    EventUpdateCandleCallbacks = [];

    BufferCandlesticksSize = 21;

    constructor(BufferCandlestickSize) {
        this.BufferCandlesticksSize = BufferCandlestickSize;
    }

    addCandle(candle) {
        if (this.Candles.has(candle.startTime)) {
            this.Candles.set(candle.startTime, candle);
            this.notifyEventUpdateCandles(candle, this.Candles);
            return;
        }

        if (this.Candles.size >= this.BufferCandlesticksSize) {
            const firstKey = this.Candles.keys().next().value;
            this.Candles.delete(firstKey);
        }

        this.Candles.set(candle.startTime, candle);
    }

    getCandles() {
        return this.Candles;
    }

    subscribeToUpdateCandle(cb) {
        this.EventUpdateCandleCallbacks.push(cb);
    }

    notifyEventUpdateCandles(candle, candles) {
        for (let i = 0; i < this.EventUpdateCandleCallbacks.length; i++) {
            this.EventUpdateCandleCallbacks[i](candle, candles);
        }
    }
}

module.exports.DataFeedCore = DataFeedCore;