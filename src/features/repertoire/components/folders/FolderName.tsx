import { FolderNameForm } from './FolderNameForm';
import { ICONS } from '@/util/constants';
import type { FormEvent } from 'react';
import type { StateSetter } from '@/types/utility';
import { IconButton } from '@/components/util/IconButton';

type FolderNameProps = {
    name: string;
    isRenaming: boolean;
    setIsRenaming: StateSetter<boolean>;
    updateFolderName: (e: FormEvent) => void;
};

export function FolderName({
    name,
    isRenaming,
    setIsRenaming,
    updateFolderName,
}: FolderNameProps) {
    return isRenaming ? (
        <FolderNameForm
            ariaLabel="rename folder"
            defaultValue={name}
            handleSubmit={updateFolderName}
            submit={{ icon: ICONS.TICK, text: 'Set new folder name' }}
            cancel={{ icon: ICONS.CROSS, text: 'Cancel folder rename' }}
            discardForm={() => setIsRenaming(false)}
        />
    ) : (
        <>
            <h2>{name}</h2>
            <IconButton
                type="button"
                icon={ICONS.PENCIL}
                ariaLabel="rename folder"
                onClick={() => setIsRenaming(true)}
            />
        </>
    );
}
