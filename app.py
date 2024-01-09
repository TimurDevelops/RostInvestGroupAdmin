from flask import Flask
from flask_cors import CORS

from routes.auth import auth_blueprint


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app.register_blueprint(auth_blueprint, url_prefix="/auth")


if __name__ == '__main__':
    app.run()
