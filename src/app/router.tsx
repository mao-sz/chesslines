import { createBrowserRouter } from 'react-router';
import { App } from './App';
import { RepertoirePage } from '@/features/repertoire/RepertoirePage';
import { TrainerPage } from '@/features/trainer/TrainerPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'repertoire?', element: <RepertoirePage /> },
            { path: 'trainer', element: <TrainerPage /> },
        ],
    },
]);
