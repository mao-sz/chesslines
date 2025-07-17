import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import { Chessboard } from './Chessboard';

function ChessboardTestWrapper({ FEN }: { FEN: string }) {
    const { activeColour, position, moves } = useRepertoireChessboard(
        undefined,
        FEN
    );
    return (
        <Chessboard
            playerColour={activeColour}
            orientation={'w'}
            position={position.current}
            playMove={moves.play}
        />
    );
}

const PREPROMOTION_FEN = '5k2/1P6/8/8/8/8/8/3K4 w - - 0 1';

describe('Promotion', () => {
    it('Opens promotion options when pawn lands on promotion rank', async () => {
        const user = userEvent.setup();
        render(<ChessboardTestWrapper FEN={PREPROMOTION_FEN} />);

        const b7Square = screen.getByRole('button', { name: /b7/i });
        const b8Square = screen.getByRole('button', { name: /b8/i });

        await user.click(b7Square);
        await user.click(b8Square);

        expect(
            screen.getByRole('list', { name: /promotion options/i })
        ).toBeInTheDocument();

        ['queen', 'knight', 'rook', 'bishop'].forEach((piece) => {
            expect(
                screen.getByRole('button', {
                    name: new RegExp(`promote to ${piece}`, 'i'),
                })
            ).toBeInTheDocument();
        });
    });

    it('Closes promotion options when clicking dialog backdrop', async () => {
        const user = userEvent.setup();
        render(<ChessboardTestWrapper FEN={PREPROMOTION_FEN} />);

        const b7Square = screen.getByRole('button', { name: /b7/i });
        const b8Square = screen.getByRole('button', { name: /b8/i });

        await user.click(b7Square);
        await user.click(b8Square);

        const dialog = screen.getByRole('dialog');

        // cannot directly target the ::backdrop specifically
        // clicking the ::backdrop is the same as clicking the dialog itself (not a child element)
        await user.click(dialog);

        expect(
            screen.queryByRole('list', { name: /promotion options/i })
        ).not.toBeInTheDocument();
    });

    it.each([
        ['queen', 'Q'],
        ['knight', 'N'],
        ['rook', 'R'],
        ['bishop', 'B'],
    ])(
        'Promotes pawn to %s when landing on promotion square',
        async (promotedPieceName, promotedPieceLetter) => {
            const user = userEvent.setup();
            render(<ChessboardTestWrapper FEN={PREPROMOTION_FEN} />);

            const b7Square = screen.getByRole('button', { name: /b7/i });
            const b8Square = screen.getByRole('button', { name: /b8/i });

            await user.click(b7Square);
            await user.click(b8Square);

            const optionButton = screen.getByRole('button', {
                name: new RegExp(`promote to ${promotedPieceName}`, 'i'),
            });
            await user.click(optionButton);

            expect(
                screen.queryByRole('list', { name: /promotion options/i })
            ).not.toBeInTheDocument();
            expect(b8Square).toHaveAttribute(
                'data-contains',
                promotedPieceLetter
            );
        }
    );
});
