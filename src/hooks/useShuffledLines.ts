import { useState } from 'react';
import { toShuffled } from '@/util/util';
import type { RepertoireLine } from '@/types/repertoire';

export function useShuffledLines(lines: RepertoireLine[]) {
    const [shuffledLines, setShuffledLines] = useState(toShuffled(lines));
    const [currentLine, setCurrentLine] = useState(shuffledLines[0]);
    return {
        currentLine: currentLine,
        progress: lines.length - shuffledLines.length + 1,
        toNextLine() {
            const remainingLines = shuffledLines.slice(1);
            setShuffledLines(remainingLines);
            setCurrentLine(remainingLines[0]);
        },
    };
}
