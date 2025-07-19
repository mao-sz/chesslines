import { NavLink } from 'react-router';

export function Header() {
    return (
        <header>
            <nav>
                <NavLink to="/repertoire">Repertoire</NavLink>
                <NavLink to="/trainer">Trainer</NavLink>
            </nav>
        </header>
    );
}
