type ExportButtonProps = { dataToExport: string; buttonText: string };

export function ExportButton({ dataToExport, buttonText }: ExportButtonProps) {
    function downloadDataAsFile(): void {
        const file = new Blob([dataToExport], { type: 'text/plain' });
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
        <button type="button" onClick={downloadDataAsFile}>
            {buttonText}
        </button>
    );
}
