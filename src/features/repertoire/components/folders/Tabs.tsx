import type { Colour } from '@/types/chessboard';
import type { StateSetter } from '@/types/utility';
import styles from './folders.module.css';

type TabsProps = { currentTab: Colour; setCurrentTab: StateSetter<Colour> };

export function Tabs({ currentTab, setCurrentTab }: TabsProps) {
    return (
        <div className={styles.tabs} role="tablist">
            <button
                id={styles.whiteTab}
                className={styles.tab}
                role="tab"
                aria-label="white repertoire"
                aria-selected={currentTab === 'w'}
                onClick={() => setCurrentTab('w')}
            >
                White
            </button>
            <button
                id={styles.blackTab}
                className={styles.tab}
                role="tab"
                aria-label="black repertoire"
                aria-selected={currentTab === 'b'}
                onClick={() => setCurrentTab('b')}
            >
                Black
            </button>
        </div>
    );
}
