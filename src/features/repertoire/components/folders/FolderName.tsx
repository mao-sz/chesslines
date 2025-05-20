import { FolderNameForm } from './FolderNameForm';
import { CHARS } from '@/util/constants';
import type { FormEvent } from 'react';
import type { StateSetter } from '@/types/utility';

type FolderNameProps = {
    name: string;
    isCollapseArrowShowing: boolean;
    isFolderOpen: boolean;
    isRenaming: boolean;
    setIsRenaming: StateSetter<boolean>;
    updateFolderName: (e: FormEvent) => void;
};

export function FolderName({
    name,
    isCollapseArrowShowing,
    isFolderOpen,
    isRenaming,
    setIsRenaming,
    updateFolderName,
}: FolderNameProps) {
    return isRenaming ? (
        <FolderNameForm
            ariaLabel="rename folder"
            defaultValue={name}
            handleSubmit={updateFolderName}
            submitText={[CHARS.TICK, 'Set new folder name']}
            cancelText={[CHARS.CROSS, 'Cancel folder rename']}
            discardForm={() => setIsRenaming(false)}
        />
    ) : (
        <>
            {isCollapseArrowShowing && (
                <CollapseArrow isFolderOpen={isFolderOpen} />
            )}
            <h2>{name}</h2>
            <button
                aria-label="rename folder"
                onClick={() => setIsRenaming(true)}
            >
                {CHARS.PENCIL}
            </button>
        </>
    );
}

function CollapseArrow({ isFolderOpen }: { isFolderOpen: boolean }) {
    return isFolderOpen ? CHARS.OPEN : CHARS.CLOSED;
}
