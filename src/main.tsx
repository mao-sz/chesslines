// global styles must be imported first else local rules that compose global rules
// will have local styles overwritten by global styles.
// Loading global first lets local styles override global ones when composed.
import '@/app/global.css';
import '@/app/reset.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './app/routes';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
