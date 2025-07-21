import { useState } from 'react';
import { toShuffled } from '@/util/util';
import type { RepertoireLine } from '@/types/repertoire';

export function useShuffledLines(lines: [string, RepertoireLine][]) {
    const [remainingLines, setRemainingLines] = useState(toShuffled(lines));
    const [currentLine, setCurrentLine] = useState(remainingLines[0]);
    return {
        currentLine: currentLine,
        progress: lines.length - remainingLines.length + 1,
        toNextLine() {
            const newRemainingLines = remainingLines.slice(1);
            setRemainingLines(newRemainingLines);
            setCurrentLine(newRemainingLines[0]);
        },
    };
}
