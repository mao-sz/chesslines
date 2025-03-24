import { CROSS } from '@/util/constants';
import type { FormEvent } from 'react';
import type { UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';

type LineProps = {
    id: UUID;
    lines: RepertoireWithMethods['lines'];
    startingFEN: string;
    PGN: string;
};

export function Line({ id, lines, startingFEN, PGN }: LineProps) {
    function updateLineDetails(field: 'FEN' | 'PGN') {
        return (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newFEN =
                field === 'FEN' ? e.currentTarget.value : startingFEN;
            const newPGN = field === 'PGN' ? e.currentTarget.value : PGN;
            lines.updateLine(id, newFEN, newPGN);
        };
    }

    function deleteLine() {
        lines.delete(id);
    }

    return (
        <>
            <label>
                Starting FEN:
                <input
                    type="text"
                    name="startingFEN"
                    value={startingFEN}
                    onInput={updateLineDetails('FEN')}
                />
            </label>
            <label>
                PGN:
                <textarea
                    name="PGN"
                    value={PGN}
                    onInput={updateLineDetails('PGN')}
                />
            </label>
            <button type="button" aria-label="delete line" onClick={deleteLine}>
                {CROSS}
            </button>
        </>
    );
}
