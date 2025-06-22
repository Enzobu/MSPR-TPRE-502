from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required     # type: ignore
from datetime import datetime, timedelta
from connect_db import DBConnection

prediction_namespace = Namespace('prediction', description="Gestion des prédictions")

prediction_model = prediction_namespace.model('Prediction', {
    'id_prediction': fields.Integer(readonly=True),
    'id_country': fields.Integer,
    'id_disease': fields.Integer,
    'ds': fields.String(description='Date de la prédiction'),

    'yhat': fields.Float,
    'yhat_lower': fields.Float,
    'yhat_upper': fields.Float,

    'trend': fields.Float,
    'trend_lower': fields.Float,
    'trend_upper': fields.Float,

    'deaths': fields.Float,
    'deaths_lower': fields.Float,
    'deaths_upper': fields.Float,

    'pib': fields.Float,
    'pib_lower': fields.Float,
    'pib_upper': fields.Float,

    'population': fields.Float,
    'population_lower': fields.Float,
    'population_upper': fields.Float
})

@prediction_namespace.route('/predictions')
class PredictionResource(Resource):
    @jwt_required()
    @prediction_namespace.response(200, 'Succès')
    @prediction_namespace.response(400, 'Requête invalide')
    @prediction_namespace.response(500, 'Erreur serveur')
    def get(self):
        """Récupérer les prédictions par maladie entre deux dates, si la période est valide"""
        try:
            disease_id = request.args.get('disease_id')
            start_date_str = request.args.get('start_date')
            end_date_str = request.args.get('end_date')

            if not disease_id or not start_date_str or not end_date_str:
                return {'msg': "Paramètres requis : disease_id, start_date, end_date"}, 400

            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError:
                return {'msg': "Les dates doivent être au format YYYY-MM-DD"}, 400

            today = datetime.today().date()
            max_end_date = today + timedelta(days=90)

            if start_date < today:
                return {'msg': "La date de début ne peut pas être antérieure à aujourd'hui"}, 400
            if end_date > max_end_date:
                return {'msg': "La date de fin ne peut pas dépasser 3 mois à partir d'aujourd'hui"}, 400

            with DBConnection() as conn:
                cur = conn.cursor()
                cur.execute("""
                    SELECT 
                        id_prediction, id_country, id_disease, ds,
                        yhat, yhat_lower, yhat_upper,
                        trend, trend_lower, trend_upper,
                        deaths, deaths_lower, deaths_upper,
                        pib, pib_lower, pib_upper,
                        population, population_lower, population_upper
                    FROM prediction
                    WHERE id_disease = %s
                    AND ds BETWEEN %s AND %s
                    ORDER BY ds ASC
                """, (disease_id, start_date, end_date))

                rows = cur.fetchall()

                predictions = []
                for row in rows:
                    predictions.append({
                        'id_prediction': row[0],
                        'id_country': row[1],
                        'id_disease': row[2],
                        'ds': row[3].strftime('%Y-%m-%d'),

                        'yhat': row[4],
                        'yhat_lower': row[5],
                        'yhat_upper': row[6],

                        'trend': row[7],
                        'trend_lower': row[8],
                        'trend_upper': row[9],

                        'deaths': row[10],
                        'deaths_lower': row[11],
                        'deaths_upper': row[12],

                        'pib': row[13],
                        'pib_lower': row[14],
                        'pib_upper': row[15],

                        'population': row[16],
                        'population_lower': row[17],
                        'population_upper': row[18],
                    })

                return predictions, 200

        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500
