import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Layout from './Components/Layout';

import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';
import NoticeFeedPage from './Pages/notices/NoticeFeedPage';
import NoticeAdminPage from './Pages/notices/NoticeAdminPage';
import NoticeFormPage from './Pages/notices/NoticeFormPage';
import QuestionsListPage from './Pages/qa/QuestionsListPage';
import AskQuestionPage from './Pages/qa/AskQuestionPage';
import QuestionDetailPage from './Pages/qa/QuestionDetailPage';
import ProfilePage from './Pages/profile/ProfilePage';
import RequestAccessPage from './Pages/access/RequestAccessPage';
import NotFoundPage from './Pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<Layout />}>
                  <Route
                    path="/request-access"
                    element={
                      <ProtectedRoute>
                        <RequestAccessPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD">
                        <NoticeFeedPage scope="general" />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notices/faculty"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD">
                        <NoticeFeedPage scope="faculty" />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notices/department"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD">
                        <NoticeFeedPage scope="department" />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/questions"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD">
                        <QuestionsListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/questions/:id"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD">
                        <QuestionDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/questions/new"
                    element={
                      <ProtectedRoute requireService="NOTICE_BOARD" requireLevel="WRITE">
                        <AskQuestionPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/notices"
                    element={
                      <ProtectedRoute requireAdmin>
                        <NoticeAdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notices/new"
                    element={
                      <ProtectedRoute requireAdmin>
                        <NoticeFormPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
