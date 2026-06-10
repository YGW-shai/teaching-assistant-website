from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.role import Role
from app.models.user import User
from app.core.security import get_password_hash


def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if roles already exist
        if db.query(Role).first():
            print("Database already initialized.")
            # Check if test users exist
            if not db.query(User).first():
                _create_test_users(db)
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

        # Create test users
        _create_test_users(db)
    finally:
        db.close()


def _create_test_users(db):
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    teacher_role = db.query(Role).filter(Role.name == "teacher").first()
    student_role = db.query(Role).filter(Role.name == "student").first()

    test_users = [
        User(student_id="admin", username="admin", hashed_password=get_password_hash("123456"), full_name="系统管理员", role_id=admin_role.id),
        User(student_id="T001", username="T001", hashed_password=get_password_hash("123456"), full_name="张教师", role_id=teacher_role.id),
        User(student_id="2024001", username="2024001", hashed_password=get_password_hash("123456"), full_name="李同学", role_id=student_role.id),
        User(student_id="2024002", username="2024002", hashed_password=get_password_hash("123456"), full_name="王同学", role_id=student_role.id),
    ]

    for user in test_users:
        db.add(user)

    db.commit()
    print("Test users created:")
    print("  Admin:    admin / 123456")
    print("  Teacher:  T001 / 123456")
    print("  Student:  2024001 / 123456")
    print("  Student:  2024002 / 123456")


if __name__ == "__main__":
    init_db()
