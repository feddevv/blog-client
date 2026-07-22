import { Outlet } from 'react-router';
import Header from './Header';

export default function Root() {
  return (
    <>
      <Header />

      <Outlet />

      <footer></footer>
    </>
  );
}
