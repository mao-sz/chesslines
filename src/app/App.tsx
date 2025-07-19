import { Outlet } from 'react-router';
import { Header } from './Header';
import { helpers } from '@/testing/helpers';

export function App() {
    // TODO: Use external persistent storage!
    const repertoire = helpers.repertoire.manyFoldersAndLines;
    const linesToTrain = Object.values(repertoire.lines);

    return (
        <>
            <Header />
            <Outlet context={{ repertoire, linesToTrain }} />
        </>
    );
}
