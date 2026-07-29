import { createBrowserRouter, RouterProvider } from 'react-router';
import Root from './layout/Root';
import Home from './pages/Home/Home';
import Post from './pages/Post/Post';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/post/:id',
        element: <Post />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
