import type { Colour } from '@/types/chessboard';
import type { StateSetter } from '@/types/utility';

type TabsProps = { currentTab: Colour; setCurrentTab: StateSetter<Colour> };

export function Tabs({ currentTab, setCurrentTab }: TabsProps) {
    return (
        <div role="tablist">
            <button
                id="white-tab"
                role="tab"
                aria-label="white repertoire"
                aria-selected={currentTab === 'w'}
                onClick={() => setCurrentTab('w')}
            >
                White
            </button>
            <button
                id="black-tab"
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
