import { Outlet } from 'react-router';
import Header from './Header';
import { Toaster } from 'sonner';
import { useUser } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';

export default function Root() {
  const { isPending } = useUser();

  return (
    <>
      <Header />

      <main className="mt-16 flex-1 flex flex-col">
        {isPending ? <Spinner className="m-auto" /> : <Outlet />}
      </main>
      <Toaster />
    </>
  );
}
