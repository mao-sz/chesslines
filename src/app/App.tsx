import { TrainerPage } from '@/features/trainer/TrainerPage';

export function App() {
    return (
        <TrainerPage
            lines={[
                {
                    pgn: '1. e4 e5 2. Nc3 Nf6 3. f4 exf4 4. e5 Qe7',
                    player: 'w',
                },
                { pgn: '1. e4 e5 2. Nc3 Nf6', player: 'b' },
                { pgn: '1. e4 e5 2. Nc3 Nf6', player: 'w' },
                { pgn: '1. e4 e6', player: 'w' },
                { pgn: '1. e4 a5 2. Nf3 Nf6', player: 'b' },
                { pgn: '1. d4 d5 2. Nc3 Nf6', player: 'w' },
            ]}
        />
    );
}
