export default function loadingSpinner() {
  return (
    <div className={`col-span-full flex items-center justify-center py-16 `}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#6d4c41]" />
    </div>
  );
}
