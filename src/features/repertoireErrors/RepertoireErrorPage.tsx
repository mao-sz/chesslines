import { useLayoutEffect, useRef, type FormEvent } from 'react';
import { ConfirmableButton } from '@/components/util/ConfirmableButton';
import styles from './page.module.css';

type RepertoireErrorPageProps = {
    errorReason: string;
    invalidRepertoireString: string;
};

export function RepertoireErrorPage({
    errorReason,
    invalidRepertoireString,
}: RepertoireErrorPageProps) {
    const id = 'broken-string';
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // initial textarea height to fit content
    useLayoutEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, []);

    function reloadWithNewRepertoireData(e: FormEvent): void {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const textArea = form.elements[0] as HTMLTextAreaElement;
        const newRepertoireData = textArea.value;
        window.localStorage.setItem('repertoire', newRepertoireData);
        window.location.reload();
    }

    function discardStoredRepertoire(): void {
        window.localStorage.removeItem('repertoire');
        window.location.reload();
    }

    function downloadRepertoireDataAsFile(): void {
        const file = new Blob([invalidRepertoireString], {
            type: 'text/plain',
        });
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(file);
        anchor.download = 'repertoire.txt';

        // do the download
        anchor.click();

        // must manually release object URL else they will not be garbage collected
        // https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob#memory_management
        URL.revokeObjectURL(anchor.href);
    }

    return (
        <main className={styles.main}>
            <h1>Error retrieving repertoire data</h1>
            <h2 className={styles.smallHeading}>Reason:</h2>
            <p className={styles.reason}>{errorReason}</p>
            <form
                className={styles.form}
                aria-label="invalid repertoire data"
                onSubmit={reloadWithNewRepertoireData}
            >
                <label htmlFor={id} className={styles.smallHeading}>
                    Invalid repertoire data:
                </label>
                <textarea
                    ref={textAreaRef}
                    id={id}
                    className={styles.data}
                    defaultValue={invalidRepertoireString}
                    onInput={(e: FormEvent) => {
                        // ensure textarea height grows with text input to fit content
                        const textArea = e.currentTarget as HTMLTextAreaElement;
                        textArea.style.height = `${textArea.scrollHeight}px`;
                    }}
                ></textarea>
                <div className={styles.formButtons}>
                    <button
                        type="button"
                        onClick={downloadRepertoireDataAsFile}
                    >
                        Export repertoire data
                    </button>
                    <button type="submit">Save</button>
                </div>
            </form>
            <div className={styles.discard}>
                <ConfirmableButton handleConfirm={discardStoredRepertoire}>
                    <button type="button" aria-describedby="discard-desc">
                        Discard repertoire
                    </button>
                </ConfirmableButton>
                <p id="discard-desc">
                    This resets the stored repertoire data to its default empty
                    state and cannot be undone!
                </p>
            </div>
        </main>
    );
}
