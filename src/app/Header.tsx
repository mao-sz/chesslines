import { NavLink } from 'react-router';
import styles from './header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                Chesslines
                <a target="_black" rel="noopener noreferrer">
                    <i
                        className="fa-brands fa-github"
                        aria-label="open github repo in new tab"
                    ></i>
                </a>
            </div>
            <nav className={styles.right}>
                <NavLink to="/repertoire">Repertoire</NavLink>
                <NavLink to="/trainer">Trainer</NavLink>
            </nav>
        </header>
    );
}
