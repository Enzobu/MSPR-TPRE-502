import pandas as pd                         # type: ignore
import psycopg2                             # type: ignore
from prophet import Prophet                 # type: ignore
from db.connection import get_connection    # type: ignore
import joblib                               # type: ignore
import matplotlib.pyplot as plt             # type: ignore
import common.utils as utils


query = utils.read_sql_query('./query/query.sql')

conn = get_connection()
df = pd.read_sql_query(query, conn)
conn.close()

df = df.rename(columns={'_date': 'ds', 'confirmed': 'y'})

colonnes_numeriques = [
    'population',
    'pib',
    'deaths',
    'is_pandemic',
]

df = df[['ds', 'y'] + colonnes_numeriques].copy()

df = df[df['y'].notna()]
df = df[df['y'] > 0]

print(df.head())

model = Prophet()
for reg in colonnes_numeriques:
    model.add_regressor(reg)

model.fit(df)

future = model.make_future_dataframe(periods=90)

for col in colonnes_numeriques:
    future[col] = df[col].iloc[-1]

forecast = model.predict(future)

print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']])

fig = model.plot(forecast)
plt.show()

joblib.dump(model, 'prophet_model.pkl')
forecast.to_csv('forecast_predictions.csv', index=False)