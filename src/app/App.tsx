import { Outlet } from 'react-router';
import { Header } from './Header';
import { LOCAL_STORAGE } from '@/util/localStorage';
import { EMPTY_REPERTOIRE } from '@/util/constants';
import type { OutletContext } from '@/types/utility';

export function App() {
    const repertoire = LOCAL_STORAGE.repertoire.get() ?? EMPTY_REPERTOIRE;

    return (
        <>
            <Header />
            <Outlet context={{ repertoire } satisfies OutletContext} />
        </>
    );
}
