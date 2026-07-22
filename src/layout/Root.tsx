import { Outlet } from 'react-router';

export default function Root() {
  return (
    <>
      <header></header>

      <Outlet />

      <footer></footer>
    </>
  );
}
