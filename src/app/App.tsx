import { Outlet } from 'react-router';
import { Header } from './Header';
import { RepertoireErrorPage } from '@/features/repertoireErrors/RepertoireErrorPage';
import { LOCAL_STORAGE } from '@/util/localStorage';
import { EMPTY_REPERTOIRE } from '@/util/constants';
import type { OutletContext } from '@/types/utility';

export function App() {
    const { validationError, repertoire } = LOCAL_STORAGE.repertoire.get();

    return (
        <>
            <Header />
            {validationError === null ? (
                <Outlet
                    context={
                        {
                            repertoire: repertoire ?? EMPTY_REPERTOIRE,
                        } satisfies OutletContext
                    }
                />
            ) : (
                <RepertoireErrorPage
                    errorReason={validationError}
                    invalidRepertoireString={repertoire}
                />
            )}
        </>
    );
}
