from flask import Flask
from flask_cors import CORS

from routes.auth import auth_blueprint
from routes.users import users_blueprint


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(users_blueprint, url_prefix="/users")


if __name__ == '__main__':
    app.run()
