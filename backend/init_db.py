from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.role import Role
from app.models.user import User


def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if roles already exist
        if db.query(Role).first():
            print("Roles already initialized.")
            return

        roles = [
            Role(
                name="admin",
                description="System administrator with full access",
                permissions=["user:manage", "role:manage", "course:manage", "system:config"]
            ),
            Role(
                name="teacher",
                description="Teacher who can manage courses and students",
                permissions=["course:manage", "student:view", "assignment:manage"]
            ),
            Role(
                name="student",
                description="Student who can learn and practice",
                permissions=["course:learn", "practice:code", "agent:chat"]
            ),
        ]

        for role in roles:
            db.add(role)

        db.commit()
        print("Database initialized with default roles: admin, teacher, student")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
