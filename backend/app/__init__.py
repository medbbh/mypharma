from flask import Flask, app
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate
from .routes.medicament import medicament_bp
from .routes.fournisseur import fournisseur_bp
from .routes.achat import achat_bp
from .routes.stock import stock_bp
from .routes.alerts import alerts_bp
from .routes.vente import vente_bp
from .routes.dashboard import dashboard_bp
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from .routes.health import health_bp
    app.register_blueprint(health_bp)
    app.register_blueprint(medicament_bp)
    app.register_blueprint(fournisseur_bp)
    app.register_blueprint(achat_bp)
    app.register_blueprint(stock_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(vente_bp)
    app.register_blueprint(dashboard_bp)
    return app
