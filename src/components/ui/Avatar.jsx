export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const inrColors = [
  "bg-[var(--brand)]",
  "bg-[var(--ai)]",
  "bg-[var(--info)]",
  "bg-[oklch(0.7_0.15_30)]",
  "bg-[oklch(0.65_0.16_300)]",
];

export default function Avatar({ name, size = 36, className = "" }) {
  // Selects a color from the array based on the first letter of the name
  const idx = (name?.charCodeAt(0) || 0) % inrColors.length;

  return (
    <div
      className={`rounded-full text-white font-semibold flex items-center justify-center ${inrColors[idx]} ${className}`}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.38 
      }}
    >
      {initials(name)}
    </div>
  );
}