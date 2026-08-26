import { createBrowserRouter, RouterProvider } from 'react-router';
import Root from './layout/Root';
import Home from './pages/Home/Home';
import Post from './pages/Post/Post';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorPage from './components/ErrorPage';
import SignInForm from './pages/Auth/SignInForm';
import RegisterForm from './pages/Auth/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: '/post/:id',
            element: <Post />,
          },
          {
            path: '/login',
            element: (
              <ProtectedRoute guestOnly={true}>
                <SignInForm />
              </ProtectedRoute>
            ),
          },
          {
            path: '/register',
            element: (
              <ProtectedRoute guestOnly={true}>
                <RegisterForm />,
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
