import zod from 'zod';
import { StoredRepertoire } from '@/types/zodSchemas';
import type { Repertoire } from '@/types/repertoire';

// in case more local storage keys need adding in the future
const KEYS = { REPERTOIRE: 'repertoire' } as const;

export const LOCAL_STORAGE = {
    repertoire: {
        get():
            | { validationError: null; repertoire: Repertoire | null }
            | { validationError: string; repertoire: string } {
            const repertoireString = window.localStorage.getItem(
                KEYS.REPERTOIRE
            );

            if (!repertoireString) {
                return { validationError: null, repertoire: null };
            }

            try {
                const parsedJSON = JSON.parse(repertoireString);
                const repertoire = StoredRepertoire.parse(parsedJSON);
                return { validationError: null, repertoire: repertoire };
            } catch (error) {
                if (error instanceof zod.ZodError) {
                    return {
                        validationError: zod.prettifyError(error),
                        repertoire: repertoireString,
                    };
                } else {
                    return {
                        validationError:
                            'There was a syntax error in the stored repertoire data',
                        repertoire: repertoireString,
                    };
                }
            }
        },
        set(repertoire: Repertoire): void {
            window.localStorage.setItem(
                KEYS.REPERTOIRE,
                JSON.stringify(repertoire)
            );
        },
    },
};
