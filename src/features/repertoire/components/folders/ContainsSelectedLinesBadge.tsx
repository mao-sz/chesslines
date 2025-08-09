import { Badge } from '@/components/util/Badge';

export function ContainsSelectedLinesBadge() {
    return (
        <Badge
            contents="✔"
            tooltipText="Folder contains lines selected for training"
            backgroundColour="var(--bg-very-light)"
            textShade="contrast"
        />
    );
}
