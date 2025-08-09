type BadgeProps = {
    contents: string | number;
    tooltipText: string;
    backgroundColour?: string;
    textShade?: 'normal' | 'faint' | 'contrast';
};

export function Badge({
    contents,
    tooltipText,
    backgroundColour,
    textShade,
}: BadgeProps) {
    return (
        <span
            className="badge"
            style={{
                backgroundColor: backgroundColour,
                color: `var(--text-${textShade})`,
            }}
            title={tooltipText}
        >
            {String(contents)}
        </span>
    );
}
