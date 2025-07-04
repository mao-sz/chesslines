import { TextInput } from '@/components/TextInput';
import { IconButton } from '@/components/IconButton';
import type { FormEvent } from 'react';
import type { FontAwesomeIcon } from '@/types/utility';
import styles from './folders.module.css';

type FolderNameFormProps = {
    ariaLabel: string;
    defaultValue?: string;
    handleSubmit: (e: FormEvent) => void;
    submit: { icon: FontAwesomeIcon; text: string };
    cancel: { icon: FontAwesomeIcon; text: string };
    discardForm: () => void;
};

export function FolderNameForm({
    ariaLabel,
    defaultValue = '',
    handleSubmit,
    submit,
    cancel,
    discardForm,
}: FolderNameFormProps) {
    return (
        <form
            className={styles.form}
            aria-label={ariaLabel}
            onSubmit={handleSubmit}
        >
            <TextInput
                name="name"
                defaultValue={defaultValue}
                isRequired={true}
                labelText="Name"
            />
            <IconButton
                type="submit"
                icon={submit.icon}
                ariaLabel={submit.text}
            />
            <IconButton
                type="button"
                icon={cancel.icon}
                ariaLabel={cancel.text}
                onClick={discardForm}
            />
        </form>
    );
}
