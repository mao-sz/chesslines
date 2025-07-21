import { Link, useOutletContext } from 'react-router';
import { Trainer } from './components/Trainer';
import { useShuffledLines } from '@/hooks/useShuffledLines';
import type { OutletContext } from '@/types/utility';
import styles from './trainer-page.module.css';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';

export function TrainerPage() {
    document.title = 'Chesslines | Trainer';

    // TODO: Implement pre-trainer line select page!
    const { repertoire } = useOutletContext<OutletContext>();
    const linesToTrain = Object.values(repertoire.lines);

    const { currentLine, toNextLine, progress } =
        useShuffledLines(linesToTrain);
    const hasLinesLeft = progress < linesToTrain.length;

    return (
        <main className={styles.main}>
            <Trainer key={progress} line={currentLine} />

            <div className={styles.side}>
                <div className={styles.progress}>
                    <p>
                        Line {progress}/{linesToTrain.length}
                    </p>

                    {hasLinesLeft && (
                        <IconButton
                            type="button"
                            ariaLabel="next line"
                            icon={ICONS.NEXT}
                            onClick={toNextLine}
                        />
                    )}
                </div>

                <div className={styles.hints}>
                    <button>Highlight piece</button>
                    <button>Show notes</button>
                </div>

                <div>
                    {/* TODO: Use location state to transfer line ID to open that line straight away */}
                    <Link
                        className={styles.lineLink}
                        to="/repertoire"
                        target="_blank"
                        rel="noopener"
                        aria-label="open line in new tab"
                    >
                        Study line <i className={ICONS.NEW_TAB}></i>
                    </Link>
                </div>
            </div>
        </main>
    );
}
