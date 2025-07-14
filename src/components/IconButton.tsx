import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import type { FontAwesomeIcon } from '@/types/utility';

type IconButtonProps = {
    type: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    icon: FontAwesomeIcon;
    ariaLabel: string;
    onClick?: (e: MouseEvent) => void | (() => void);
};

export function IconButton({
    type,
    icon,
    ariaLabel,
    onClick,
}: IconButtonProps) {
    return (
        <button
            className="iconButton"
            type={type}
            aria-label={ariaLabel}
            onClick={onClick}
        >
            <i className={icon}></i>
        </button>
    );
}
