import { type FormEvent, useEffect, useRef, useState } from 'react';
import { LOCAL_STORAGE } from '@/util/localStorage';
import { onBackdropClick } from '@/util/util';
import { StoredRepertoire } from '@/types/zodSchemas';
import tabStyles from '../folders/folders.module.css';
import modalStyles from './import.module.css';

type ImportModalProps = { closeModal: () => void };

export function ImportModal({ closeModal }: ImportModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [currentTab, setCurrentTab] = useState<'text' | 'file'>('text');
    const [validationError, setValidationError] = useState('');

    // can't actually reuse the same ID as the folder colour tabs
    // but can't compose using IDs with CSS modules
    // don't want to hard-duplicate tab styles in import.module.css
    const leftTabID = `modal-${tabStyles.leftTab}`;
    const rightTabID = `modal-${tabStyles.rightTab}`;

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    async function importRepertoire(e: FormEvent): Promise<void> {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const input = form.elements[0];
        const repertoireString = await (async () => {
            switch (currentTab) {
                case 'text': {
                    return (input as HTMLTextAreaElement).value;
                }
                case 'file': {
                    const file = (input as HTMLInputElement).files?.item(0);
                    return file ? await file.text() : file;
                }
            }
        })();

        if (!repertoireString || typeof repertoireString !== 'string') {
            return;
        }
        try {
            const parsedJSON = JSON.parse(repertoireString);
            StoredRepertoire.parse(parsedJSON);
            LOCAL_STORAGE.repertoire.set(repertoireString);
            // stored trainable line IDs not guaranteed to exist with imported repertoire
            LOCAL_STORAGE.lineIDsToTrain.set([]);
            window.location.reload();
        } catch {
            setValidationError('Invalid repertoire string');
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className={modalStyles.dialog}
            onClick={onBackdropClick(closeModal)}
            onClose={closeModal}
        >
            <div
                role="tablist"
                className={`${tabStyles.tabs} ${modalStyles.tabs}`}
            >
                <button
                    id={leftTabID}
                    className={tabStyles.tab}
                    role="tab"
                    aria-selected={currentTab === 'text'}
                    onClick={() => setCurrentTab('text')}
                >
                    Import from text
                </button>
                <button
                    id={rightTabID}
                    className={tabStyles.tab}
                    role="tab"
                    aria-selected={currentTab === 'file'}
                    onClick={() => setCurrentTab('file')}
                >
                    Import from file
                </button>
            </div>

            <div
                role="tabpanel"
                aria-labelledby={currentTab === 'text' ? leftTabID : rightTabID}
            >
                <form onSubmit={importRepertoire} aria-label="import data">
                    {currentTab === 'text' ? (
                        <>
                            <label htmlFor="repertoire-string">
                                Repertoire string
                            </label>
                            <textarea
                                id="repertoire-string"
                                name="repertoire-string"
                                onChange={() => setValidationError('')}
                                required
                            ></textarea>
                        </>
                    ) : (
                        <>
                            <label htmlFor="repertoire-file">
                                Repertoire file (.json or .txt)
                            </label>
                            <input
                                type="file"
                                id="repertoire-file"
                                name="repertoire-file"
                                accept=".json,.txt"
                                onChange={() => setValidationError('')}
                                required
                            />
                        </>
                    )}

                    <div>
                        {validationError && (
                            <p className={modalStyles.error}>
                                {validationError}
                            </p>
                        )}
                        <button type="button" onClick={closeModal}>
                            Cancel
                        </button>
                        <button type="submit">Import</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
