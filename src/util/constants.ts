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
} as const satisfies Record<string, FontAwesomeIcon>;

export const STANDARD_STARTING_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
