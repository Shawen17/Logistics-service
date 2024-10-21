import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Spinner from './components/Spinner/Spinner';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Logout from './components/Logout/Logout';

const DeliveryPage = lazy(() => import('./pages/Delivery/DeliveryPage'));
const Performance = lazy(() => import('./pages/Performance/Performance'));
const ProductsPage = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage/SignupPage'));
const KanbanBoard = lazy(() => import('./pages/KanbanBoard/KanbanBoard'));
const PickerDashBoard = lazy(
  () => import('./pages/PickerDashBoard/PickerDashBoard')
);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <KanbanBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <DeliveryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/picker"
              element={
                <ProtectedRoute>
                  <PickerDashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
