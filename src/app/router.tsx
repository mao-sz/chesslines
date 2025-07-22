import { App } from './App';
import { RepertoirePage } from '@/features/repertoire/RepertoirePage';
import { TrainerPage } from '@/features/trainer/TrainerPage';

export const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'repertoire?', element: <RepertoirePage /> },
            { path: 'trainer', element: <TrainerPage /> },
        ],
    },
];
