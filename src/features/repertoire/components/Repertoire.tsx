import { Folder } from './Folder';
import type { Colour } from '@/types/chessboard';

type RepertoireProps = { colour: Colour };

export function Repertoire({ colour }: RepertoireProps) {
    return (
        <>
            <Folder />
        </>
    );
}
