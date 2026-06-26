from database import db


class WorldCupSelection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    team_name = db.Column(db.String, nullable=False)
    group = db.Column(db.String, nullable=False)        # ej. "Grupo A"
    phase = db.Column(db.String, nullable=False)        # ej. "Final"

    user = db.relationship('User', backref='selections')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_name": self.team_name,
            "group": self.group,
            "phase": self.phase,
        }