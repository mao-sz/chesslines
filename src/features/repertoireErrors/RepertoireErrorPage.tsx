type RepertoireErrorPageProps = {
    errorReason: string;
    invalidRepertoireString: string;
};

export function RepertoireErrorPage({
    errorReason,
    invalidRepertoireString,
}: RepertoireErrorPageProps) {
    const id = 'broken-string';

    return (
        <main>
            <h1>Error retrieving repertoire data</h1>
            <h2>Reason:</h2>
            <p>{errorReason}</p>
            <form aria-label="invalid repertoire data">
                <label htmlFor={id}>Invalid repertoire data:</label>
                <textarea
                    id={id}
                    defaultValue={invalidRepertoireString}
                ></textarea>
                <button type="submit">Save</button>
            </form>
            <button type="button">Discard repertoire</button>
        </main>
    );
}
