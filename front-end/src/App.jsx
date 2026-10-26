import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';

// Lazy Loading per halaman
const GamePage = lazy(() => import('./pages/GamePage'));
const LabirinPage = lazy(() => import('./pages/LabirinPage'));
const LautPage = lazy(() => import('./pages/LautPage'));
const MateriPage = lazy(() => import('./pages/MateriPage'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Halaman utama langsung menuju Game */}
              <Route path="/" element={<GamePage />} />

              {/* Halaman lainnya */}
              <Route path="/game" element={<GamePage />} />
              <Route path="/labirin" element={<LabirinPage />} />
              <Route path="/laut" element={<LautPage />} />
              <Route path="/materi" element={<MateriPage />} />

              {/* Kompatibilitas URL lama */}
              <Route path="/index.php" element={<Navigate to="/" replace />} />
              <Route path="/beranda.php" element={<Navigate to="/" replace />} />
              <Route path="/game.php" element={<Navigate to="/game" replace />} />
              <Route path="/labirin.php" element={<Navigate to="/labirin" replace />} />
              <Route path="/laut.php" element={<Navigate to="/laut" replace />} />
              <Route path="/materi.php" element={<Navigate to="/materi" replace />} />

              {/* URL tidak dikenal kembali ke Game */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
