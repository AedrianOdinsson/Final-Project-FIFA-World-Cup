import os

# Carga .env ANTES de cualquier blueprint que lea os.getenv() al import time.
# routes/stats.py congela ZAFRONIX_API_KEY = os.getenv(...) en su línea 11;
# si load_dotenv() corre despues, el snapshot queda en None para todo el proceso.
from dotenv import load_dotenv
load_dotenv()

from routes.selection import selection_bp
from routes.stats import stats_bp
from database import db
from flask import Flask
from flask_cors import CORS
from routes.user import user_bp

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(selection_bp)
app.register_blueprint(stats_bp)
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=False)