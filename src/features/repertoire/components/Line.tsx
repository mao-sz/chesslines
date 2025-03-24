import { type FormEvent, useState } from 'react';
import type { UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';

type LineProps = {
    id: UUID;
    lines: RepertoireWithMethods['lines'];
    loadedStartingFEN: string;
    loadedPGN: string;
};

export function Line({ id, lines, loadedStartingFEN, loadedPGN }: LineProps) {
    const [startingFEN, setStartingFEN] = useState(loadedStartingFEN);
    const [PGN, setPGN] = useState(loadedPGN);

    function saveLine(e: FormEvent) {
        e.preventDefault();
        lines.updateLine(id, startingFEN, PGN);
    }

    return (
        <form onSubmit={saveLine}>
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
            <button aria-label="save line">Save</button>
        </form>
    );
}
