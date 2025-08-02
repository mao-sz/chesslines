import type { Repertoire } from '@/types/repertoire';

// in case more local storage keys need adding in the future
const KEYS = { REPERTOIRE: 'repertoire' } as const;

export const LOCAL_STORAGE = {
    repertoire: {
        get(): Repertoire | null {
            const repertoireString = window.localStorage.getItem(
                KEYS.REPERTOIRE
            );
            // TODO: Use Zod for validation/type safety!
            return JSON.parse(repertoireString ?? 'null');
        },
        set(repertoire: Repertoire): void {
            window.localStorage.setItem(
                KEYS.REPERTOIRE,
                JSON.stringify(repertoire)
            );
        },
    },
};
