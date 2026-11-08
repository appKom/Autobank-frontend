interface HighlightTextProps {
  text: string;
  query?: string | null;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Wraps every case-insensitive occurrence of `query` in `text` in a <mark>.
const HighlightText = ({ text, query }: HighlightTextProps) => {
  const trimmed = query?.trim();
  if (!trimmed) return <>{text}</>;

  // With a capture group, split() puts the matches at the odd indices.
  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'i'));

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="bg-yellow-300 text-inherit rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export default HighlightText;
