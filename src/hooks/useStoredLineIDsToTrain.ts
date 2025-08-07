import { SetStateAction, useState } from 'react';
import { LOCAL_STORAGE } from '@/util/localStorage';
import type { UUID } from '@/types/utility';

export function useStoredLineIDsToTrain(): [
    UUID[],
    (newLineIDs: SetStateAction<UUID[]>) => void,
] {
    const [lineIDsToTrain, setLineIDsToTrain] = useState<UUID[]>(
        LOCAL_STORAGE.lineIDsToTrain.get()
    );

    return [
        lineIDsToTrain,
        // wrapper around setState to also set in local storage
        (newLineIDs: SetStateAction<UUID[]>) => {
            if (typeof newLineIDs === 'function') {
                setLineIDsToTrain((prev) => {
                    const newStateValue = newLineIDs(prev);
                    LOCAL_STORAGE.lineIDsToTrain.set(newStateValue);
                    return newStateValue;
                });
            } else {
                setLineIDsToTrain(newLineIDs);
                LOCAL_STORAGE.lineIDsToTrain.set(newLineIDs);
            }
        },
    ];
}
