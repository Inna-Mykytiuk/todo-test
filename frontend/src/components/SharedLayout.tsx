
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

export default function SharedLayout() {
  return (

    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>

  );
};