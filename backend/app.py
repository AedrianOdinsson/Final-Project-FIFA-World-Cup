import os

from routes.selection import selection_bp
from database import db
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from routes.user import user_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(selection_bp)
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=False)
