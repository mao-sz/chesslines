import { useState } from 'react';

type LineProps = { loadedStartingFEN: string; loadedPGN: string };

export function Line({ loadedStartingFEN, loadedPGN }: LineProps) {
    const [startingFEN, setStartingFEN] = useState(loadedStartingFEN);
    const [PGN, setPGN] = useState(loadedPGN);

    return (
        <form>
            <label>
                Starting FEN:
                <input
                    type="text"
                    name="startingFEN"
                    value={startingFEN}
                    onInput={(e) => setStartingFEN(e.currentTarget.value)}
                />
            </label>
            <label>
                PGN:
                <textarea
                    name="PGN"
                    value={PGN}
                    onInput={(e) => setPGN(e.currentTarget.value)}
                />
            </label>
        </form>
    );
}
