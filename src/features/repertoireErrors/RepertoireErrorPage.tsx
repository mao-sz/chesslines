import { FormEvent } from 'react';

type RepertoireErrorPageProps = {
    errorReason: string;
    invalidRepertoireString: string;
};

export function RepertoireErrorPage({
    errorReason,
    invalidRepertoireString,
}: RepertoireErrorPageProps) {
    const id = 'broken-string';

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

    return (
        <main>
            <h1>Error retrieving repertoire data</h1>
            <h2>Reason:</h2>
            <p>{errorReason}</p>
            <form
                aria-label="invalid repertoire data"
                onSubmit={reloadWithNewRepertoireData}
            >
                <label htmlFor={id}>Invalid repertoire data:</label>
                <textarea
                    id={id}
                    defaultValue={invalidRepertoireString}
                ></textarea>
                <button type="submit">Save</button>
            </form>
            <button type="button" onClick={discardStoredRepertoire}>
                Discard repertoire
            </button>
        </main>
    );
}
