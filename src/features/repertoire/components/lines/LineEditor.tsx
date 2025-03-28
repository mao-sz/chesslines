import { type FormEvent, useEffect, useRef } from 'react';
import type { UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';

type LineEditorProps = {
    id: UUID | 'new';
    lines: RepertoireWithMethods['lines'];
    parentFolder: RepertoireFolderID;
    closeEditor: () => void;
};

export function LineEditor({
    id,
    lines,
    parentFolder,
    closeEditor,
}: LineEditorProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const line = id === 'new' ? null : lines[id];

    useEffect(() => {
        // Ensure object ref does not change by the time the cleanup runs
        const dialog = dialogRef.current;
        dialog?.showModal();

        return () => dialog?.close();
    }, []);

    function saveLine(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = (form.elements[0] as HTMLInputElement).value;
        const PGN = (form.elements[1] as HTMLTextAreaElement).value;

        if (id === 'new') {
            lines.create(startingFEN, PGN, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, PGN);
        }
        closeEditor();
    }

    return (
        <dialog ref={dialogRef}>
            <form onSubmit={saveLine}>
                <label>
                    Starting FEN{' '}
                    <input
                        name="startingFEN"
                        defaultValue={line?.startingFEN}
                    />
                </label>
                <label>
                    PGN <textarea name="PGN" defaultValue={line?.PGN} />
                </label>
                <button>Save</button>
            </form>
        </dialog>
    );
}
