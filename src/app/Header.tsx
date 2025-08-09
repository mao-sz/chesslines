import { NavLink } from 'react-router';
import styles from './header.module.css';

type HeaderProps = { selectedLinesCount: number };

export function Header({ selectedLinesCount }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                Chesslines
                <a
                    href="https://github.com/MaoShizhong/chesslines"
                    target="_black"
                    rel="noreferrer"
                >
                    <i
                        className="fa-brands fa-github"
                        aria-label="open github repo in new tab"
                    ></i>
                </a>
            </div>
            <nav className={styles.right}>
                <NavLink to="/repertoire">Repertoire</NavLink>
                <NavLink to="/trainer">
                    Trainer
                    {selectedLinesCount > 0 && (
                        <span
                            title={`${selectedLinesCount} ${selectedLinesCount === 1 ? 'line' : 'lines'} selected`}
                        >
                            {' '}
                            ({selectedLinesCount})
                        </span>
                    )}
                </NavLink>
            </nav>
        </header>
    );
}
