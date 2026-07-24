import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

export default function Root() {
  return (
    <>
      <Header />

      <main className="mt-16">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
