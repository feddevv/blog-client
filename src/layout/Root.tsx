import { Outlet } from 'react-router';
import Header from './Header';
import { Toaster } from 'sonner';

export default function Root() {
  return (
    <>
      <Header />

      <main className="mt-16 flex-1 flex flex-col">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
