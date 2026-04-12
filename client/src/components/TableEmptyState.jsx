export default function TableEmptyState({ title, subtitle }) {
  return (
    <div className="px-6 py-10 text-center">
      <h3 className="text-base font-bold text-[#5d4037]">{title}</h3>
      <p className="mt-2 text-sm text-[#8d6e63]">{subtitle}</p>
    </div>
  );
}
