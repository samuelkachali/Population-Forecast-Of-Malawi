import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from flask import Flask, request, jsonify, send_from_directory
import joblib
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load historical data once (assumed saved as CSV)
nhits_df = pd.read_csv('nhits_df.csv', parse_dates=['ds'])

# Load Prophet model and scaler once
prophet_model = joblib.load('prophet_improved_model.pkl')
scaler = joblib.load('prophet_regressor_scaler.pkl')

selected_regressors = [
    "Population by 1-year age groups and sex",
    "Life expectancy E(x) - complete",
    "Urban population growth (annual %)"
]

@app.route('/predict_regressors', methods=['POST'])
@cross_origin()
def predict_regressors():
    data = request.get_json()
    years = data.get('years', [])
    if not years:
        return jsonify({'error': 'Provide years'}), 400
    df_reg = nhits_df.copy()
    df_reg['year'] = df_reg['ds'].dt.year
    future_years = np.array(years).reshape(-1, 1)
    future_regressors = {}
    for reg in selected_regressors:
        X = df_reg[['year']].values
        y = df_reg[reg].values
        model = LinearRegression()
        model.fit(X, y)
        preds = model.predict(future_years)
        future_regressors[reg] = preds
    future_reg_df = pd.DataFrame({'ds': pd.to_datetime([f'{y}-12-31' for y in years])})
    for reg in selected_regressors:
        future_reg_df[reg] = future_regressors[reg]
    future_reg_df['ds'] = future_reg_df['ds'].dt.strftime('%Y-%m-%d')
    return future_reg_df.to_json(orient='records')

@app.route('/predict_population', methods=['POST'])
@cross_origin()
def predict_population():
    data = request.get_json()
    regressors = data.get('regressors', [])
    if not regressors:
        return jsonify({'error': 'Provide regressors data'}), 400
    df = pd.DataFrame(regressors)
    if df.empty or not all(reg in df.columns for reg in selected_regressors):
        return jsonify({'error': 'Regressor columns missing or empty'}), 400
    df['ds'] = pd.to_datetime(df['ds'])
    # Scale regressors
    df[selected_regressors] = scaler.transform(df[selected_regressors])
    forecast = prophet_model.predict(df)
    forecast['yhat'] = np.exp(forecast['yhat'])
    forecast['yhat_lower'] = np.exp(forecast['yhat_lower'])
    forecast['yhat_upper'] = np.exp(forecast['yhat_upper'])
    result = df[['ds']].copy()
    result['Predicted_Population'] = forecast['yhat']
    result['Lower_Bound'] = forecast['yhat_lower']
    result['Upper_Bound'] = forecast['yhat_upper']
    result['ds'] = result['ds'].dt.strftime('%Y-%m-%d')
    if result.empty or result['Predicted_Population'].isnull().all():
        return jsonify({'error': 'Prediction failed or returned blank'}), 500
    return result.to_json(orient='records')

@app.route('/api/test')
def test():
    return "Test route is working!"

@app.route('/api/train-predictions')
def train_predictions():
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
    return send_from_directory(data_dir, 'train_predictions.json')

@app.route('/api/test-actuals')
def test_actuals():
    return send_from_directory('utils/data', 'test_actuals.json')

print("Registered routes:", app.url_map)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
