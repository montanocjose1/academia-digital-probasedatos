import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.course_routes import course_bp
from routes.progress_routes import progress_bp
from routes.evaluation_routes import evaluation_bp
from routes.admin_routes import admin_bp
from routes.ga_routes import ga_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config['FRONTEND_URL']}})
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(course_bp, url_prefix='/api/courses')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(evaluation_bp, url_prefix='/api/evaluations')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ga_bp, url_prefix='/api/ga')

    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'version': '1.0.0', 'platform': 'Academia Digital Pro'}

    with app.app_context():
        from models import user, course, progress, evaluation
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
