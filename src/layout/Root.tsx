import { Outlet } from 'react-router';
import Header from './Header';

export default function Root() {
  return (
    <>
      <Header />

      <main className="mt-16">
        <Outlet />
      </main>

      <footer></footer>
    </>
  );
}
