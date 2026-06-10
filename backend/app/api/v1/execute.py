import ast
import subprocess
import tempfile
import os
from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/execute", tags=["execute"])


class ExecuteRequest(BaseModel):
    code: str


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: int


# 禁止导入的模块列表
BLOCKED_MODULES = {
    "os",
    "sys",
    "subprocess",
    "shutil",
    "socket",
    "urllib",
    "http",
    "ftplib",
    "pickle",
    "ctypes",
    "multiprocessing",
    "threading",
}


def check_imports(code: str) -> list[str]:
    """AST 检查代码中是否有危险导入"""
    violations = []
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Syntax error: {e.msg} at line {e.lineno}",
        )

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                top = alias.name.split(".")[0]
                if top in BLOCKED_MODULES:
                    violations.append(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                top = node.module.split(".")[0]
                if top in BLOCKED_MODULES:
                    violations.append(node.module)
    return violations


@router.post("/", response_model=ExecuteResponse)
def execute_python(req: ExecuteRequest):
    if len(req.code) > 100_000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code too long (max 100KB)",
        )

    violations = check_imports(req.code)
    if violations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Forbidden imports: {', '.join(violations)}",
        )

    # 写入临时文件执行（避免命令行注入）
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(req.code)
        tmp_path = f.name

    try:
        start = datetime.now()
        result = subprocess.run(
            ["python", tmp_path],
            capture_output=True,
            text=True,
            timeout=5,
        )
        elapsed = int((datetime.now() - start).total_seconds() * 1000)

        # 截断超长输出
        stdout = result.stdout[:50_000]
        stderr = result.stderr[:50_000]

        return ExecuteResponse(
            stdout=stdout,
            stderr=stderr,
            exit_code=result.returncode,
            execution_time_ms=elapsed,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Execution timeout (max 5 seconds)",
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
