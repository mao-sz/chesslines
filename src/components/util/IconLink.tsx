import { Link } from 'react-router';
import { capitalise } from '@/util/util';
import type { ComponentProps } from 'react';
import type { FontAwesomeIcon } from '@/types/utility';

type IconButtonProps = {
    to: ComponentProps<typeof Link>['to'];
    icon: FontAwesomeIcon;
    ariaLabel: string;
    autoFocus?: boolean;
};

export function IconLink({ to, icon, ariaLabel, autoFocus }: IconButtonProps) {
    return (
        <Link
            to={to}
            className="iconButton"
            aria-label={ariaLabel}
            title={capitalise(ariaLabel)}
            autoFocus={autoFocus}
        >
            <i className={icon}></i>
        </Link>
    );
}
