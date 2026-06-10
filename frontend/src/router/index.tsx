import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/Layout/MainLayout'
import RequireAuth from '../components/Auth/RequireAuth'
import Login from '../pages/Login'

// 公共
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Agent from '../pages/Agent'

// 学生端
import StudentHome from '../pages/StudentHome'
import Course from '../pages/Course'
import Practice from '../pages/Practice'

// 教师端
import TeacherHome from '../pages/TeacherHome'
import CourseEditor from '../pages/CourseEditor'
import Homework from '../pages/Homework'
import Exam from '../pages/Exam'

// 管理员端
import AdminHome from '../pages/AdminHome'
import UserManage from '../pages/UserManage'
import Admin from '../pages/Admin'

import { useUserStore } from '../stores/userStore'

// 角色守卫组件
function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user } = useUserStore()
  if (!user || !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

// 角色首页重定向
function RoleRedirect() {
  const { user } = useUserStore()
  const role = user?.role_name || 'student'

  if (role === 'admin') return <Navigate to="/admin/home" replace />
  if (role === 'teacher') return <Navigate to="/teacher/home" replace />
  return <Navigate to="/home" replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RoleRedirect /> },

      // 学生端
      { path: 'home', element: <StudentHome /> },
      { path: 'course', element: <Course /> },
      { path: 'course/:id', element: <Course /> },
      { path: 'practice', element: <Practice /> },

      // 教师端（教师 + 管理员可访问）
      {
        path: 'teacher/home',
        element: (
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <TeacherHome />
          </RoleGuard>
        ),
      },
      {
        path: 'course-editor',
        element: (
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <CourseEditor />
          </RoleGuard>
        ),
      },
      {
        path: 'course-editor/:id',
        element: (
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <CourseEditor />
          </RoleGuard>
        ),
      },
      {
        path: 'homework',
        element: (
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <Homework />
          </RoleGuard>
        ),
      },
      {
        path: 'exam',
        element: (
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <Exam />
          </RoleGuard>
        ),
      },

      // 管理员端
      {
        path: 'admin/home',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdminHome />
          </RoleGuard>
        ),
      },
      {
        path: 'user-manage',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <UserManage />
          </RoleGuard>
        ),
      },

      // 公共
      { path: 'agent', element: <Agent /> },
      { path: 'profile', element: <Profile /> },

      // 兼容旧路由
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'admin-old',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <Admin />
          </RoleGuard>
        ),
      },
    ],
  },
])
