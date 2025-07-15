import type { FontAwesomeIcon } from '@/types/utility';

export const ICONS = {
    TICK: 'fa-solid fa-check',
    CROSS: 'fa-solid fa-xmark',
    BIN: 'fa-solid fa-trash',
    PENCIL: 'fa-solid fa-pencil',
    OPENED: 'fa-solid fa-caret-down',
    CLOSED: 'fa-solid fa-caret-right',
    PLUS: 'fa-solid fa-plus',
    NEW_FOLDER: 'fa-solid fa-folder-plus',
    NEXT: 'fa-solid fa-forward-step',
    END: 'fa-solid fa-forward-fast',
    PREVIOUS: 'fa-solid fa-backward-step',
    START: 'fa-solid fa-backward-fast',
} as const satisfies Record<string, FontAwesomeIcon>;

export const STANDARD_STARTING_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
