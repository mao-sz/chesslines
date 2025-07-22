import { type MouseEvent, useEffect, useRef } from 'react';
import { Square } from './Square';
import type {
    Colour,
    MoveInfo,
    PromotionPieceLetter,
} from '@/types/chessboard';
import styles from './chessboard.module.css';

type PromotionOptionsProps = {
    colour: Colour;
    from: string;
    to: string;
    closeOptions: (e: MouseEvent) => void;
    play: (move: MoveInfo) => void;
};

export function PromotionOptions({
    colour,
    from,
    to,
    closeOptions,
    play,
}: PromotionOptionsProps) {
    const optionsRef = useRef<HTMLDialogElement>(null);

    const [file, rank] = to;
    const options = ['Q', 'N', 'R', 'B'] as const;

    useEffect(() => {
        optionsRef.current?.showModal();
    }, []);

    // custom positioning of promotion options over target square
    const promotionSquare = document.querySelector(
        `[aria-label="${to} square"]`
    );
    const promotionSquareCoords = promotionSquare?.getBoundingClientRect();

    function handleClick(e: MouseEvent): void {
        const targetElement = e.target as HTMLElement;
        if (targetElement === e.currentTarget) {
            closeOptions(e);
        } else if (targetElement.tagName === 'BUTTON') {
            play({
                from: from,
                to: to,
                promoteTo: targetElement.dataset
                    .contains as PromotionPieceLetter,
            });
        }
    }

    return (
        <dialog
            ref={optionsRef}
            className={styles.promotions}
            style={{
                top: promotionSquareCoords?.top,
                left: promotionSquareCoords?.left,
            }}
            onClick={handleClick}
        >
            <ul
                className={styles.options}
                role="list"
                aria-label="promotion options"
            >
                {options.map((piece) => (
                    <Square
                        key={piece}
                        player={colour}
                        contains={colour === 'w' ? piece : piece.toLowerCase()}
                        rank={Number(rank)}
                        file={file}
                        showsRankCoordinate={false}
                        showsFileCoordinate={false}
                        selectedSquare={null}
                        isPromotionOption={true}
                    />
                ))}
            </ul>
        </dialog>
    );
}
