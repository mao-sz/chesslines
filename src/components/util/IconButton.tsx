import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import type { FontAwesomeIcon } from '@/types/utility';

type IconButtonProps = {
    type: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    icon: FontAwesomeIcon;
    ariaLabel: string;
    onClick?: (e: MouseEvent) => void | (() => void);
    autoFocus?: boolean;
};

export function IconButton({
    type,
    icon,
    ariaLabel,
    onClick,
    autoFocus,
}: IconButtonProps) {
    return (
        <button
            className="iconButton"
            type={type}
            aria-label={ariaLabel}
            onClick={onClick}
            autoFocus={autoFocus}
        >
            <i className={icon}></i>
        </button>
    );
}
