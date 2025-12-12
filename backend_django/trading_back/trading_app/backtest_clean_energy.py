import os, pandas as pd
from .ml_models.pivot import PivotStrategy
from .ml_models.nextday_prediction import NextDayPredictor

def run_backtest(universe_csv, price_dir, start_date, end_date, use_predictor=True):
    piv = PivotStrategy()
    pred = NextDayPredictor()
    uni = pd.read_csv(universe_csv)
    results = []

    for _, row in uni.iterrows():
        symbol = row['symbol']
        fpath = os.path.join(price_dir, f"{symbol}.csv")
        if not os.path.exists(fpath): 
            continue
        df = pd.read_csv(fpath, parse_dates=['date'])
        df = df[(df['date'] >= start_date) & (df['date'] <= end_date)].sort_values('date').reset_index(drop=True)
        if len(df) < 2:
            continue

        # Iterate signals: day i generates trade on day i+1
        for i in range(len(df)-1):
            hi, lo, cl = df.loc[i, ['high','low','close']]
            o_n, h_n, l_n, c_n = df.loc[i+1, ['open','high','low','close']]

            signal = piv.predict(hi, lo, cl)['signal']

            if use_predictor:
                p = pred.predict(symbol, df.loc[i,'open'], hi, lo, cl, int(df.loc[i,'volume']))
                if p['prediction'] == 'DOWN':
                    continue

            if signal in ('BUY','STRONG_BUY','HOLD_BULLISH'):
                entry = float(o_n)
                tp = entry * 1.04
                sl = entry * 0.97

                if float(h_n) >= tp:
                    exit_px = tp
                    outcome = 'TP'
                elif float(l_n) <= sl:
                    exit_px = sl
                    outcome = 'SL'
                else:
                    exit_px = float(c_n)
                    outcome = 'EOD'

                ret = (exit_px - entry) / entry
                results.append({
                    'symbol': symbol,
                    'trade_date': str(df.loc[i+1,'date'].date()),
                    'entry': round(entry, 4),
                    'exit': round(exit_px, 4),
                    'ret_pct': round(ret*100, 3),
                    'outcome': outcome
                })

    res = pd.DataFrame(results)
    if res.empty:
        return {'message': 'No trades generated'}

    # Summary
    win_rate = (res['ret_pct'] > 0).mean() * 100
    avg_ret = res['ret_pct'].mean()
    med_ret = res['ret_pct'].median()
    best = res['ret_pct'].max()
    worst = res['ret_pct'].min()
    by_symbol = res.groupby('symbol')['ret_pct'].mean().sort_values(ascending=False).round(3).to_dict()

    os.makedirs('trading_app/data/reports', exist_ok=True)
    res.to_csv('trading_app/data/reports/clean_energy_backtest_week.csv', index=False)

    summary = {
        'trades': int(len(res)),
        'win_rate_pct': round(win_rate, 1),
        'avg_return_pct': round(avg_ret, 2),
        'median_return_pct': round(med_ret, 2),
        'best_trade_pct': round(best, 2),
        'worst_trade_pct': round(worst, 2),
        'by_symbol_avg_pct': by_symbol,
        'report': 'trading_app/data/reports/clean_energy_backtest_week.csv'
    }
    return summary
