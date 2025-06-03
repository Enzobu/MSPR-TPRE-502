from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore
from connect_db import DBConnection
import bcrypt # type: ignore

user_namespace = Namespace('user', description="Gestion des utilisateurs")

# Modele User pour swagger / validation
user_model = user_namespace.model('User', {
    'id_user': fields.Integer(readonly=True, description='ID de l\'utilisateur'),
    'firstname': fields.String(required=True, description='Prénom'),
    'lastname': fields.String(required=True, description='Nom'),
    'email': fields.String(required=True, description='Adresse email'),
    'password': fields.String(required=True, description='Mot de passe (non retourne dans les reponses)'),
})

# Modele login (email + password)
login_model = user_namespace.model('Login', {
    'email': fields.String(required=True, description="Adresse email de l'utilisateur"),
    'password': fields.String(required=True, description='Mot de passe')
})

# Modele token JWT retourne lors du login
token_model = user_namespace.model('Token', {
    'access_token': fields.String(description="Token JWT d'authentification")
})

@user_namespace.route('/users/login')
class LoginResource(Resource):
    @user_namespace.expect(login_model)
    @user_namespace.response(200, 'Succes', token_model)
    @user_namespace.response(400, "Email et mot de passe requis")
    @user_namespace.response(404, 'Utilisateur non trouve')
    @user_namespace.response(401, 'Mot de passe incorrect')
    @user_namespace.response(500, 'Erreur serveur')
    def post(self):
        """Authentification et obtention d'un token JWT"""
        try:
            data = request.get_json()
            if not data or not isinstance(data, dict):
                return {'msg': "Donnees invalides"}, 400

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return {'msg': "Email et mot de passe requis"}, 400

            with DBConnection() as conn:
                cur = conn.cursor()
                cur.execute("SELECT id_user, password FROM users WHERE email = %s", (email,))
                user = cur.fetchone()

                if not user:
                    return {'msg': "Utilisateur non trouve"}, 404

                hashed_password = user[1]

                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    access_token = create_access_token(identity=str(user[0]))
                    return {'access_token': access_token}, 200
                else:
                    return {'msg': "Mot de passe incorrect"}, 401

        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500

@user_namespace.route('/users')
class UserListResource(Resource):
    @jwt_required()
    @user_namespace.marshal_list_with(user_model, skip_none=True)
    @user_namespace.response(200, 'Succes')
    @user_namespace.response(500, 'Erreur serveur')
    def get(self):
        """Recuperer la liste de tous les utilisateurs (sans les passwords)"""
        try:
            with DBConnection() as conn:
                cur = conn.cursor()
                cur.execute("SELECT id_user, firstname, lastname, email FROM users")
                users = cur.fetchall()
                users_list = [{'id_user': user[0], 'firstname': user[1], 'lastname': user[2], 'email': user[3]} for user in users]
                return users_list, 200
        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500

    @user_namespace.expect(user_model)
    @user_namespace.response(201, 'Utilisateur cree')
    @user_namespace.response(400, 'Donnees invalides')
    @user_namespace.response(500, 'Erreur serveur')
    def post(self):
        """Creer un nouvel utilisateur"""
        try:
            data = request.get_json()
            if not data or not isinstance(data, dict):
                return {'msg': "Donnees invalides"}, 400

            firstname = data.get('firstname')
            lastname = data.get('lastname')
            email = data.get('email')
            password = data.get('password')

            if not firstname or not lastname or not email or not password:
                return {'msg': "Veuillez respecter la structure de la table"}, 400

            # Hashage du mot de passe
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            with DBConnection() as conn:
                cur = conn.cursor()
                # Verifier si email dejà utilise
                cur.execute("SELECT id_user FROM users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {'msg': "Email dejà utilise"}, 400

                cur.execute("INSERT INTO users (firstname, lastname, email, password) VALUES (%s, %s, %s, %s) RETURNING id_user",
                            (firstname, lastname, email, hashed_password))
                new_id = cur.fetchone()[0]
                conn.commit()

            return {'id_user': new_id, 'firstname': firstname, 'lastname': lastname, 'email': email}, 201
        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500

@user_namespace.route('/users/<int:user_id>')
class UserResource(Resource):
    @jwt_required()
    @user_namespace.marshal_with(user_model, skip_none=True)
    @user_namespace.response(200, 'Succes')
    @user_namespace.response(404, 'Utilisateur non trouve')
    @user_namespace.response(500, 'Erreur serveur')
    def get(self, user_id):
        """Recuperer un utilisateur par son ID (sans password)"""
        try:
            with DBConnection() as conn:
                cur = conn.cursor()
                cur.execute("SELECT id_user, firstname, lastname, email FROM users WHERE id_user = %s", (user_id,))
                user = cur.fetchone()
                if not user:
                    return {'msg': "Utilisateur non trouve"}, 404
                return {'id_user': user[0], 'firstname': user[1], 'lastname': user[2], 'email': user[3]}, 200
        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500

    @jwt_required()
    @user_namespace.expect(user_model)
    @user_namespace.response(200, 'Utilisateur mis à jour')
    @user_namespace.response(400, 'Donnees invalides')
    @user_namespace.response(404, 'Utilisateur non trouve')
    @user_namespace.response(500, 'Erreur serveur')
    def put(self, user_id):
        """Mettre à jour un utilisateur (firstname, lastname, email et/ou mot de passe)"""
        try:
            data = request.get_json()
            if not data or not isinstance(data, dict):
                return {'msg': "Donnees invalides"}, 400

            firstname = data.get('firstname')
            lastname = data.get('lastname')
            email = data.get('email')
            password = data.get('password')

            if not firstname or  not lastname or not email and not password:
                return {'msg': "Au moins un champ (firstname, lastname, email ou password) requis"}, 400

            with DBConnection() as conn:
                cur = conn.cursor()

                # Vérifier que l'utilisateur existe
                cur.execute("SELECT id_user FROM users WHERE id_user = %s", (user_id,))
                if not cur.fetchone():
                    return {'msg': "Utilisateur non trouvé"}, 404

                if email:
                    # Vérifier si email déjà utilisé par un autre utilisateur
                    cur.execute("SELECT id_user FROM users WHERE email = %s AND id_user != %s", (email, user_id))
                    if cur.fetchone():
                        return {'msg': "Email déjà utilisé"}, 400

                if password:
                    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

                # Construction de la requête dynamique
                update_fields = []
                update_values = []

                if email:
                    update_fields.append("email = %s")
                    update_values.append(email)

                if hashed_password:
                    update_fields.append("password = %s")
                    update_values.append(hashed_password)

                if firstname:
                    update_fields.append("firstname = %s")
                    update_values.append(firstname)

                if lastname:
                    update_fields.append("lastname = %s")
                    update_values.append(lastname)

                if update_fields:
                    update_values.append(user_id)
                    query = f"UPDATE users SET {', '.join(update_fields)} WHERE id_user = %s"
                    cur.execute(query, tuple(update_values))
                    conn.commit()

                return {'msg': "Utilisateur mis à jour"}, 200
        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500

    @jwt_required()
    @user_namespace.response(200, 'Utilisateur supprime avec succes')
    @user_namespace.response(404, 'Utilisateur non trouve')
    @user_namespace.response(500, 'Erreur serveur')
    def delete(self, user_id):
        """Supprimer un utilisateur"""
        try:
            with DBConnection() as conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM users WHERE id_user = %s RETURNING id_user", (user_id,))
                deleted = cur.fetchone()
                if not deleted:
                    return {'msg': "Utilisateur non trouve"}, 404
                conn.commit()
                return {'msg': "Utilisateur supprime"}, 200
        except Exception as e:
            return {'msg': f"Erreur serveur : {str(e)}"}, 500
