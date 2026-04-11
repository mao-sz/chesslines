import type { Dispatch, SetStateAction } from 'react';
import type { Repertoire } from '@chesslines/types/repertoire';
import type { UUID } from '@chesslines/types/utility';

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

type FontAwesomeIconName =
    | 'trash'
    | 'pencil'
    | 'folder-plus'
    | 'grip-lines-vertical'
    | 'check'
    | 'xmark'
    | 'plus'
    | 'forward-step'
    | 'forward-fast'
    | 'backward-step'
    | 'backward-fast'
    | 'plus'
    | 'caret-down'
    | 'caret-right'
    | 'arrow-up-right-from-square';
export type FontAwesomeIcon = `fa-solid fa-${FontAwesomeIconName}`;

export type OutletContext = {
    repertoire: Repertoire;
    lineIDsToTrain: UUID[];
    setLineIDsToTrain: StateSetter<UUID[]>;
};
