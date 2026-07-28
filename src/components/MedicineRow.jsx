const INPUT_CLASSES =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'

function MedicineRow({
    medicine,
    rowNumber,
    canRemove,
    onChange,
    onRemove,
}) {
    const fieldId = (fieldName) =>
        `medicine-${medicine.id}-${fieldName}`

    function updateField(field, value) {
        onChange(medicine.id, field, value)
    }

    return (
        <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <legend className="px-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Medicine {rowNumber}
            </legend>

            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => onRemove(medicine.id)}
                    disabled={!canRemove}
                    aria-label={`Remove medicine ${rowNumber}`}
                    title={
                        canRemove
                            ? `Remove medicine ${rowNumber}`
                            : 'At least one medicine row is required'
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-xl font-semibold leading-none text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-white"
                >
                    ×
                </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <label
                    htmlFor={fieldId('name')}
                    className="text-sm font-medium text-slate-700 lg:col-span-2"
                >
                    Medicine Name

                    <input
                        id={fieldId('name')}
                        name={fieldId('name')}
                        type="text"
                        value={medicine.name}
                        onChange={(event) =>
                            updateField('name', event.target.value)
                        }
                        placeholder="Tab. Rupadin 10 mg (Rupatadine Fumarate)"
                        className={`${INPUT_CLASSES} font-bengali`}
                    />
                </label>

                <div className="lg:col-span-2">
                    <p className="text-sm font-medium text-slate-700">
                        Dosage
                    </p>

                    <div className="mt-1 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-2">
                        <label
                            htmlFor={fieldId('morning')}
                            className="text-xs font-medium text-slate-600"
                        >
                            Morning

                            <input
                                id={fieldId('morning')}
                                name={fieldId('morning')}
                                type="text"
                                inputMode="text"
                                value={medicine.morning}
                                onChange={(event) =>
                                    updateField('morning', event.target.value)
                                }
                                placeholder="0"
                                className={INPUT_CLASSES}
                            />
                        </label>

                        <span
                            aria-hidden="true"
                            className="pb-2 text-lg font-bold text-slate-500"
                        >
                            +
                        </span>

                        <label
                            htmlFor={fieldId('noon')}
                            className="text-xs font-medium text-slate-600"
                        >
                            Noon

                            <input
                                id={fieldId('noon')}
                                name={fieldId('noon')}
                                type="text"
                                inputMode="text"
                                value={medicine.noon}
                                onChange={(event) =>
                                    updateField('noon', event.target.value)
                                }
                                placeholder="0"
                                className={INPUT_CLASSES}
                            />
                        </label>

                        <span
                            aria-hidden="true"
                            className="pb-2 text-lg font-bold text-slate-500"
                        >
                            +
                        </span>

                        <label
                            htmlFor={fieldId('night')}
                            className="text-xs font-medium text-slate-600"
                        >
                            Night

                            <input
                                id={fieldId('night')}
                                name={fieldId('night')}
                                type="text"
                                inputMode="text"
                                value={medicine.night}
                                onChange={(event) =>
                                    updateField('night', event.target.value)
                                }
                                placeholder="1"
                                className={INPUT_CLASSES}
                            />
                        </label>
                    </div>
                </div>

                <label
                    htmlFor={fieldId('duration')}
                    className="text-sm font-medium text-slate-700"
                >
                    Duration

                    <input
                        id={fieldId('duration')}
                        name={fieldId('duration')}
                        type="text"
                        value={medicine.duration}
                        onChange={(event) =>
                            updateField('duration', event.target.value)
                        }
                        placeholder="2 months"
                        className={`${INPUT_CLASSES} font-bengali`}
                    />
                </label>

                <label
                    htmlFor={fieldId('instruction')}
                    className="text-sm font-medium text-slate-700"
                >
                    Special Instruction

                    <input
                        id={fieldId('instruction')}
                        name={fieldId('instruction')}
                        type="text"
                        value={medicine.instruction}
                        onChange={(event) =>
                            updateField('instruction', event.target.value)
                        }
                        placeholder="SOS / after food / খাবারের পরে"
                        className={`${INPUT_CLASSES} font-bengali`}
                    />
                </label>
            </div>
        </fieldset>
    )
}

export default MedicineRow
