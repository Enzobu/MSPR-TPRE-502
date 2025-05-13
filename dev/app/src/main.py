import pandas as pd
import psycopg2
from prophet import Prophet
from db.connection import get_connection
import joblib
import matplotlib.pyplot as plt
import common.utils as utils

query = utils.read_sql_query('./query/query.sql')

conn = get_connection()

df = pd.read_sql_query(query, conn)
conn.close()

print(df.head())

model = Prophet()

model.add_regressor('population')
model.add_regressor('pib')
model.add_regressor('id_continent')
model.add_regressor('id_region')

model.fit(df)

future = model.make_future_dataframe(periods=90)

for col in ['population', 'pib', 'id_continent', 'id_region']:
    future[col] = df[col].iloc[-1]

forecast = model.predict(future)

print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']])

fig = model.plot(forecast)
plt.show()

joblib.dump(model, 'prophet_model.pkl')

forecast.to_csv('forecast_predictions.csv', index=False)