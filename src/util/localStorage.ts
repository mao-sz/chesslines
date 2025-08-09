import zod from 'zod';
import { StoredLineIDs, StoredRepertoire } from '@/types/zodSchemas';
import type { Repertoire } from '@/types/repertoire';
import type { UUID } from '@/types/utility';

// in case more local storage keys need adding in the future
const KEYS = {
    REPERTOIRE: 'repertoire',
    LINE_IDS_TO_TRAIN: 'line_ids_to_train',
} as const;

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
        set(repertoire: Repertoire | string): void {
            const repertoireString =
                typeof repertoire === 'string'
                    ? repertoire
                    : JSON.stringify(repertoire);
            window.localStorage.setItem(KEYS.REPERTOIRE, repertoireString);
        },
    },
    lineIDsToTrain: {
        get(): UUID[] {
            const lineIDsToTrainString = window.localStorage.getItem(
                KEYS.LINE_IDS_TO_TRAIN
            );

            if (!lineIDsToTrainString) {
                return [];
            }

            try {
                const parsedJSON = JSON.parse(lineIDsToTrainString);
                const lineIDsToTrain = StoredLineIDs.parse(parsedJSON);
                return lineIDsToTrain;
            } catch {
                return [];
            }
        },
        set(lineIDs: UUID[]): void {
            window.localStorage.setItem(
                KEYS.LINE_IDS_TO_TRAIN,
                JSON.stringify(lineIDs)
            );
        },
    },
};
