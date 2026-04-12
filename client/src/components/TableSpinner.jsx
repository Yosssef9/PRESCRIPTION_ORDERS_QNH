export default function TableSpinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-10 text-[#795548]">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#bcaaa4] border-t-[#5d4037]" />
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
}
