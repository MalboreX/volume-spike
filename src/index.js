require('dotenv').config();

const Binance = require('binance-api-node').default;
const Notification = require('./notify/notification');

const { DataFeedCore } = require('./core/data-feed-core');

const CandlestickMapToJs = require('./transformers/candlestick-map-to-array');

const CandlestickArrayToVolumes = require('./transformers/candlestick-array-to-volumes');
const VolumeSpike = require('./indicators/volume-spike');

const client = Binance();
const notification = new Notification();

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
const TIMEFRAMES = ['1m', '5m', '15m'];

const BUFFER_CANDLESTICKS_SIZE = 21;

async function bootstrap() {
    for (let SYM_INDEX = 0; SYM_INDEX < SYMBOLS.length; SYM_INDEX++) {
        for (let TF_INDEX = 0; TF_INDEX < TIMEFRAMES.length; TF_INDEX++) {
            const datafeed = new DataFeedCore(BUFFER_CANDLESTICKS_SIZE);

            let historyCandles = await client.futuresCandles({ symbol: SYMBOLS[SYM_INDEX], interval: TIMEFRAMES[TF_INDEX], limit: BUFFER_CANDLESTICKS_SIZE });
            historyCandles = historyCandles.map(candle => {
                return { ...candle, startTime: candle.openTime };
            })

            for (let i = 0; i < historyCandles.length; i++) {
                const candle = historyCandles[i];
                datafeed.addCandle(candle);
            }

            datafeed.subscribeToUpdateCandle(async (candle, candles) => {
                const candlesticksArray = CandlestickMapToJs(candles);
                const volumesArray = CandlestickArrayToVolumes(candlesticksArray);

                const volDev2 = VolumeSpike(volumesArray, 21, 2);
                const volDev3 = VolumeSpike(volumesArray, 21, 3);

                const signalKey = `${SYMBOLS[SYM_INDEX]}_${TIMEFRAMES[TF_INDEX]}_${candle.startTime}`;
                if (candle.volume > volDev3) {
                    await notification.notifyIfNotHappened(signalKey, `Volume Spike Dev. 3%0ASymbol: ${SYMBOLS[SYM_INDEX]}%0AInterval: ${TIMEFRAMES[TF_INDEX]}`);
                } else if (candle.volume > volDev2) {
                    await notification.notifyIfNotHappened(signalKey, `Volume Spike Dev. 2 %0ASymbol: ${SYMBOLS[SYM_INDEX]}%0AInterval: ${TIMEFRAMES[TF_INDEX]}`);
                }
            });

            client.ws.futuresCandles(SYMBOLS[SYM_INDEX], TIMEFRAMES[TF_INDEX], candle => {
                datafeed.addCandle(candle);
            });
        }
    }
}

(async () => {
    await bootstrap();
})();