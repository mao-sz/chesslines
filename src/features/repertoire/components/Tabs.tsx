import type { Colour } from '@/types/chessboard';
import type { RepertoireFolderID } from '@/types/repertoire';
import type { StateSetter } from '@/types/utility';

type TabsProps = {
    currentTab: Colour;
    setCurrentTab: StateSetter<Colour>;
    setCurrentFolder: StateSetter<RepertoireFolderID>;
};

export function Tabs({
    currentTab,
    setCurrentTab,
    setCurrentFolder,
}: TabsProps) {
    function changeTab(colour: Colour) {
        setCurrentTab(colour);
        setCurrentFolder(colour);
    }

    return (
        <div role="tablist">
            <button
                id="white-tab"
                role="tab"
                aria-label="white repertoire"
                aria-selected={currentTab === 'w'}
                onClick={() => changeTab('w')}
            >
                White
            </button>
            <button
                id="black-tab"
                role="tab"
                aria-label="black repertoire"
                aria-selected={currentTab === 'b'}
                onClick={() => changeTab('b')}
            >
                Black
            </button>
        </div>
    );
}
