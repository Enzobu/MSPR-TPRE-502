import pandas as pd                         # type: ignore
import psycopg2                             # type: ignore
from prophet import Prophet                 # type: ignore
from db.connection import get_connection    # type: ignore
import joblib                               # type: ignore
import matplotlib.pyplot as plt             # type: ignore
import common.utils as utils
import os

query = utils.read_sql_query('./query/query.sql')

conn = get_connection()
df = pd.read_sql_query(query, conn)
conn.close()

df = df.rename(columns={'_date': 'ds', 'confirmed': 'y'})
colonnes_numeriques = ['population', 'pib', 'deaths']
df = df[['ds', 'y', 'country_name'] + colonnes_numeriques].copy()

df = df[df['y'].notna()]
df = df[df['y'] > 0]

os.makedirs("models", exist_ok=True)
os.makedirs("predictions", exist_ok=True)
os.makedirs("plots", exist_ok=True)

for country in df['country_name'].unique():
    print(f"▶ Traitement du pays : {country}")

    df_country = df[df['country_name'] == country].copy()

    if len(df_country) < 10:
        print(f"Trop peu de données pour {country}, on skip.")
        continue


    model = Prophet()
    for reg in colonnes_numeriques:
        model.add_regressor(reg)

    model.fit(df_country)

    future = model.make_future_dataframe(periods=90)

    for col in colonnes_numeriques:
        future[col] = df_country[col].iloc[-1]

    forecast = model.predict(future)
    forecast['yhat'] = forecast['yhat'].clip(lower=0)

    print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']])

    safe_country_name = country.replace(" ", "_").replace("/", "_")
    joblib.dump(model, f"models/prophet_model_{safe_country_name}.pkl")
    forecast.to_csv(f"predictions/forecast_{safe_country_name}.csv", index=False)

    fig = model.plot(forecast)
    fig.savefig(f"plots/forecast_plot_{safe_country_name}.png")
    plt.close(fig)

    print(f"Modèle sauvegardé pour {country}.")

print("Tous les modèles sont générés.")