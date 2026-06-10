from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.role import Role
from app.models.user import User
from app.models.chapter import Chapter, KnowledgePoint
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

        # Create sample chapters and knowledge points
        _create_sample_chapters(db)
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


def _create_sample_chapters(db):
    ch1 = Chapter(key="ch1", title="第一章 绪论", sort_order=1)
    ch2 = Chapter(key="ch2", title="第二章 线性表", sort_order=2)
    db.add_all([ch1, ch2])
    db.commit()
    db.refresh(ch1)
    db.refresh(ch2)

    points = [
        KnowledgePoint(key="ch1-1", title="1.1 数据结构的基本概念", content="# 数据结构的基本概念\n\n数据结构是计算机存储、组织数据的方式。", guide="## 操作指导\n\n1. 理解数据、数据元素、数据项的概念\n2. 掌握逻辑结构和存储结构的区别\n3. 完成课后练习", default_code="# 请在这里输入你的代码\nprint(\"Hello, Data Structure!\")", sort_order=1, chapter_id=ch1.id),
        KnowledgePoint(key="ch1-2", title="1.2 算法复杂度分析", content="# 算法复杂度\n\n时间复杂度和空间复杂度是评价算法效率的重要指标。", guide="## 操作指导\n\n1. 理解大O记法\n2. 分析常见算法的时间复杂度\n3. 完成复杂度计算练习", default_code="# 计算阶乘的时间复杂度\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))", sort_order=2, chapter_id=ch1.id),
        KnowledgePoint(key="ch2-1", title="2.1 顺序表", content="# 顺序表\n\n顺序表是用一段地址连续的存储单元依次存储数据元素的线性结构。", guide="## 操作指导\n\n1. 实现顺序表的插入和删除\n2. 分析顺序表的时间复杂度\n3. 与链表进行对比", default_code="# 实现一个简单的顺序表\nclass SeqList:\n    def __init__(self, capacity=10):\n        self.data = [None] * capacity\n        self.length = 0\n\n    def append(self, item):\n        if self.length < len(self.data):\n            self.data[self.length] = item\n            self.length += 1\n\n# 测试\nlst = SeqList()\nlst.append(1)\nlst.append(2)\nprint(lst.data[:lst.length])", sort_order=1, chapter_id=ch2.id),
    ]

    for pt in points:
        db.add(pt)
    db.commit()
    print("Sample chapters and knowledge points created.")


if __name__ == "__main__":
    init_db()
