type TextInputProps = {
    name: string;
    defaultValue: string;
    isRequired: boolean;
    labelText: string;
};

export function TextInput({
    name,
    defaultValue,
    isRequired,
    labelText,
}: TextInputProps) {
    // shared component - must ensure unique ID
    const id = crypto.randomUUID();

    return (
        <div className="textInput">
            <input
                id={id}
                name={name}
                type="text"
                placeholder="" // for floating label when not in focus
                defaultValue={defaultValue}
                autoFocus={true}
                required={isRequired}
            />
            <label htmlFor={id}>
                {isRequired ? `${labelText} (required)` : labelText}
            </label>
        </div>
    );
}
