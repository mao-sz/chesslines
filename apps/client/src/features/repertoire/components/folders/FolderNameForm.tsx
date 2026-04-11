import { TextInput } from '@/components/util/TextInput';
import { IconButton } from '@/components/util/IconButton';
import type { SubmitEvent } from 'react';
import type { FontAwesomeIcon } from '@/types';
import styles from './folders.module.css';

type FolderNameFormProps = {
    ariaLabel: string;
    defaultValue?: string;
    handleSubmit: (e: SubmitEvent) => void;
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
