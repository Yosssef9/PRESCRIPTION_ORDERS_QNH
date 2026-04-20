export default function TablePagination({ pagination, onPrev, onNext }) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#d7ccc8] bg-[#fcf8f6] px-4 py-3 shadow-[0_4px_12px_rgba(78,52,46,0.05)] md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#4e342e]">
          Showing{" "}
          <span className="text-[#5d4037]">
            {pagination.total === 0
              ? 0
              : (pagination.page - 1) * pagination.pageSize + 1}
          </span>
          {" - "}
          <span className="text-[#5d4037]">
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}
          </span>{" "}
          of <span className="text-[#5d4037]">{pagination.total}</span> results
        </span>

        <span className="text-xs text-[#8d6e63]">
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          disabled={pagination.page === 1}
          onClick={onPrev}
          className="inline-flex h-10 items-center rounded-xl border border-[#d7ccc8] bg-white px-4 text-sm font-semibold text-[#5d4037] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        <div className="flex h-10 min-w-[52px] items-center justify-center rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(93,64,55,0.22)]">
          {pagination.page}
        </div>

        <button
          disabled={!pagination.hasNext}
          onClick={onNext}
          className="inline-flex h-10 items-center rounded-xl border border-[#d7ccc8] bg-white px-4 text-sm font-semibold text-[#5d4037] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
