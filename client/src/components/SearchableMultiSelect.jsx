import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";

export default function SearchableMultiSelect({
  name,
  values = [],
  onChange,
  options = [],
  error,
  placeholder = "Select sections",
  searchPlaceholder = "Search sections...",
  noResultsText = "No results found",
  getOptionLabel,
  getOptionValue,
  disabled = false,
  maxVisibleBadges = 2,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const optionLabel = (item) => {
    if (getOptionLabel) return getOptionLabel(item);
    return item.label || item.en || item.name || "";
  };

  const optionValue = (item) => {
    if (getOptionValue) return getOptionValue(item);
    return item.value;
  };

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;

    return options.filter((item) => {
      const label = String(optionLabel(item) || "").toLowerCase();
      const val = String(optionValue(item) || "").toLowerCase();
      const en = String(item.en || "").toLowerCase();
      const ar = String(item.ar || "").toLowerCase();

      return (
        label.includes(q) || val.includes(q) || en.includes(q) || ar.includes(q)
      );
    });
  }, [search, options]);

  const selectedOptions = useMemo(() => {
    return options.filter((item) => values.includes(optionValue(item)));
  }, [options, values]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const emitChange = (nextValues) => {
    onChange({
      target: {
        name,
        value: nextValues,
      },
    });
  };

  const handleToggle = (selectedValue) => {
    const exists = values.includes(selectedValue);

    if (exists) {
      emitChange(values.filter((v) => v !== selectedValue));
    } else {
      emitChange([...values, selectedValue]);
    }
  };

  const handleRemove = (selectedValue, e) => {
    e.stopPropagation();
    emitChange(values.filter((v) => v !== selectedValue));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    emitChange([]);
  };

  return (
    <div className={`relative ${open ? "z-[200]" : "z-20"}`} ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`min-h-[46px] w-full rounded-[10px] border border-[#bcaaa4] bg-[#fffdfc] px-3 py-2 text-sm outline-none transition focus:border-[#8d6e63] focus:ring-2 focus:ring-[#bcaaa4]/30 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.slice(0, maxVisibleBadges).map((item) => {
                  const itemValue = optionValue(item);
                  return (
                    <span
                      key={itemValue}
                      className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#d7ccc8] bg-[#f7f1ee] px-2.5 py-1 text-xs font-medium text-[#5d4037]"
                    >
                      <span className="truncate">{optionLabel(item)}</span>
                      <span
                        onClick={(e) => handleRemove(itemValue, e)}
                        className="cursor-pointer rounded-full p-[1px] hover:bg-[#e8ddd8]"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </span>
                  );
                })}

                {selectedOptions.length > maxVisibleBadges && (
                  <span className="rounded-full bg-[rgba(93,64,55,0.08)] px-2.5 py-1 text-xs font-medium text-[#6d4c41]">
                    +{selectedOptions.length - maxVisibleBadges} more
                  </span>
                )}
              </>
            ) : (
              <span className="truncate text-[#a1887f]">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedOptions.length > 0 && (
              <span
                onClick={clearAll}
                className="cursor-pointer text-xs font-semibold text-[#8d6e63] hover:text-[#5d4037]"
              >
                Clear
              </span>
            )}

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#8d6e63] transition duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-[210] mt-2 origin-top overflow-hidden rounded-2xl border border-[#d7ccc8] bg-white shadow-[0_20px_50px_rgba(78,52,46,0.14)]"
          >
            <div className="border-b border-[#e7ddd8] p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1887f]" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-11 w-full rounded-xl border border-[#d7ccc8] bg-[#fcf8f6] pl-10 pr-3 text-left text-sm outline-none transition focus:border-[#8d6e63] focus:bg-white focus:ring-2 focus:ring-[#bcaaa4]/30"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => {
                  const itemValue = optionValue(item);
                  const isSelected = values.includes(itemValue);

                  return (
                    <button
                      key={itemValue}
                      type="button"
                      onClick={() => handleToggle(itemValue)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                        isSelected
                          ? "bg-[rgba(93,64,55,0.08)] text-[#5d4037]"
                          : "text-[#5d4037] hover:bg-[#faf5f2]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                            isSelected
                              ? "border-[#6d4c41] bg-[#6d4c41] text-white"
                              : "border-[#bcaaa4] bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>

                        <span className="truncate text-left">
                          {optionLabel(item)}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-[#8d6e63]">
                  {noResultsText}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
