import { useEffect, useRef, useState } from 'react'

function parseItems(value) {
    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
}

function BulletEntryField({
    id,
    label,
    value,
    onChange,
    placeholder,
    addLabel,
    variant = 'card',
    showEmptyState = true,
}) {
    const [isComposerOpen, setIsComposerOpen] = useState(false)
    const [draft, setDraft] = useState('')
    const [editingIndex, setEditingIndex] = useState(null)

    const inputRef = useRef(null)
    const items = parseItems(value)
    const isEmbedded = variant === 'embedded'

    useEffect(() => {
        if (isComposerOpen) {
            inputRef.current?.focus()
        }
    }, [isComposerOpen])

    function updateItems(nextItems) {
        onChange(nextItems.join('\n'))
    }

    function openComposer() {
        setDraft('')
        setEditingIndex(null)
        setIsComposerOpen(true)
    }

    function editItem(index) {
        setDraft(items[index])
        setEditingIndex(index)
        setIsComposerOpen(true)
    }

    function cancelComposer() {
        setDraft('')
        setEditingIndex(null)
        setIsComposerOpen(false)
    }

    function saveDraft() {
        const cleanedDraft = draft.trim()

        if (!cleanedDraft) {
            return
        }

        if (editingIndex === null) {
            updateItems([...items, cleanedDraft])
        } else {
            updateItems(
                items.map((item, index) =>
                    index === editingIndex ? cleanedDraft : item,
                ),
            )
        }

        cancelComposer()
    }

    function removeItem(indexToRemove) {
        updateItems(
            items.filter((_, index) => index !== indexToRemove),
        )

        if (editingIndex === indexToRemove) {
            cancelComposer()
        }
    }

    function handleKeyDown(event) {
        if (
            event.key !== 'Enter' ||
            event.shiftKey ||
            event.nativeEvent.isComposing
        ) {
            return
        }

        event.preventDefault()
        saveDraft()
    }

    return (
        <section
            aria-labelledby={`${id}-heading`}
            className={
                isEmbedded
                    ? ''
                    : 'rounded-xl border border-slate-200 bg-slate-50 p-4'
            }
        >
            <div className="flex items-center justify-between gap-3">
                <h4
                    id={`${id}-heading`}
                    className="text-sm font-semibold text-slate-800"
                >
                    {label}
                </h4>

                <span className="text-xs font-medium text-slate-400">
                    {items.length} {items.length === 1 ? 'entry' : 'entries'}
                </span>
            </div>

            {items.length > 0 ? (
                <ul className="mt-3 space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={`${item}-${index}`}
                            className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                        >
                            <span
                                aria-hidden="true"
                                className="text-center text-sm font-bold leading-6 text-slate-500"
                            >
                                •
                            </span>

                            <span className="min-w-0 whitespace-pre-wrap font-bengali text-sm leading-6 text-slate-800">
                                {item}
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => editItem(index)}
                                    className="inline-flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-semibold leading-none text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    aria-label={`Remove ${label.toLowerCase()} entry ${index + 1
                                        }`}
                                    title="Remove entry"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-base font-semibold leading-none text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    ×
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : showEmptyState ? (
                <p className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-sm text-slate-400">
                    No {label.toLowerCase()} added
                </p>
            ) : null}

            {isComposerOpen ? (
                <div className="mt-3 rounded-lg border border-blue-200 bg-white p-3 shadow-sm">
                    <label
                        htmlFor={`${id}-composer`}
                        className="sr-only"
                    >
                        {editingIndex === null
                            ? `Add ${label}`
                            : `Edit ${label}`}
                    </label>

                    <textarea
                        ref={inputRef}
                        id={`${id}-composer`}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        placeholder={placeholder}
                        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 font-bengali text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-400">
                            Enter to save · Shift+Enter for a new line
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={cancelComposer}
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={saveDraft}
                                disabled={!draft.trim()}
                                className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {editingIndex === null
                                    ? addLabel
                                    : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openComposer}
                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-800 transition hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    + {addLabel}
                </button>
            )}
        </section>
    )
}

export default BulletEntryField
