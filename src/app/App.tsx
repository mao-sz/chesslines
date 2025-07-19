import { Outlet } from 'react-router';
import { Header } from './Header';
import { helpers } from '@/testing/helpers';
import type { OutletContext } from '@/types/utility';

export function App() {
    // TODO: Use external persistent storage!
    const repertoire = helpers.repertoire.manyFoldersAndLines;

    return (
        <>
            <Header />
            <Outlet context={{ repertoire } satisfies OutletContext} />
        </>
    );
}
