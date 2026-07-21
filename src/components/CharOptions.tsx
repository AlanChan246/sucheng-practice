interface CharOptionsProps {
  options: string[]
  onPick: (char: string) => void
  disabled?: boolean
  selected?: string | null
  reveal?: boolean
}

export function CharOptions({
  options,
  onPick,
  disabled = false,
  selected = null,
  reveal = false,
}: CharOptionsProps) {
  return (
    <div className="char-options" role="group" aria-label="選字選項">
      {options.map((char) => {
        const isSelected = selected === char
        const className = [
          'char-option',
          isSelected ? 'char-option--selected' : '',
          reveal && isSelected ? 'char-option--reveal' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={char}
            type="button"
            className={className}
            disabled={disabled}
            onClick={() => onPick(char)}
          >
            {char}
          </button>
        )
      })}
    </div>
  )
}
