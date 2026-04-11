import {
    cloneElement,
    useState,
    type HTMLProps,
    type JSX,
    type MouseEvent,
} from 'react';
import { IconButton } from './IconButton';
import { ICONS } from '@/util/constants';

type ConfirmableButtonProps = {
    handleConfirm: (e: MouseEvent) => void;
} & HTMLProps<HTMLElement>;

export function ConfirmableButton({
    handleConfirm,
    children,
}: ConfirmableButtonProps) {
    const [showingConfirm, setShowingConfirm] = useState(false);
    const clonedOriginalButton = cloneElement(children as JSX.Element, {
        onClick: () => setShowingConfirm(true),
    });

    return showingConfirm ? (
        <div className="confirmButtons">
            <IconButton
                type="button"
                ariaLabel="confirm"
                icon={ICONS.TICK}
                onClick={handleConfirm}
            />
            <IconButton
                type="button"
                ariaLabel="cancel"
                icon={ICONS.CROSS}
                onClick={() => setShowingConfirm(false)}
                autoFocus={true}
            />
        </div>
    ) : (
        clonedOriginalButton
    );
}
