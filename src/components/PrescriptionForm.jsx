import MedicineRow from './MedicineRow'

const INPUT_CLASSES =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'

const CLINICAL_TEXTAREA_FIELDS = [
    {
        name: 'complaints',
        label: 'Chief Complaints',
        placeholder: 'Enter one complaint per line',
    },
    {
        name: 'diagnosis',
        label: 'Diagnosis',
        placeholder: 'Enter one diagnosis per line',
    },
    {
        name: 'investigations',
        label: 'Investigations',
        placeholder: 'Enter one investigation per line',
    },
]

function PrescriptionForm({
    prescription,
    onFieldChange,
    onMedicineChange,
    onAddMedicine,
    onRemoveMedicine,
}) {

    function handleSubmit(event) {
        event.preventDefault()
    }

    return (
        <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
            <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    Prescription Details
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Changes appear immediately in the prescription preview.
                </p>
            </div>

            <fieldset className="mt-6">
                <legend className="text-sm font-bold uppercase tracking-wide text-slate-700">
                    Patient information
                </legend>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <label
                        htmlFor="patientName"
                        className="text-sm font-medium text-slate-700"
                    >
                        Patient Name
                        <span className="ml-1 text-red-700">*</span>

                        <input
                            id="patientName"
                            name="patientName"
                            type="text"
                            aria-required="true"
                            value={prescription.patientName}
                            onChange={(event) =>
                                onFieldChange('patientName', event.target.value)
                            }
                            placeholder="Patient's full name"
                            className={INPUT_CLASSES}
                        />
                    </label>

                    <label
                        htmlFor="age"
                        className="text-sm font-medium text-slate-700"
                    >
                        Age

                        <input
                            id="age"
                            name="age"
                            type="text"
                            value={prescription.age}
                            onChange={(event) =>
                                onFieldChange('age', event.target.value)
                            }
                            placeholder="24y 1d"
                            className={INPUT_CLASSES}
                        />
                    </label>

                    <label
                        htmlFor="gender"
                        className="text-sm font-medium text-slate-700"
                    >
                        Gender

                        <select
                            id="gender"
                            name="gender"
                            value={prescription.gender}
                            onChange={(event) =>
                                onFieldChange('gender', event.target.value)
                            }
                            className={INPUT_CLASSES}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label
                        htmlFor="weight"
                        className="text-sm font-medium text-slate-700"
                    >
                        Weight

                        <input
                            id="weight"
                            name="weight"
                            type="text"
                            value={prescription.weight}
                            onChange={(event) =>
                                onFieldChange('weight', event.target.value)
                            }
                            placeholder="68 kg"
                            className={INPUT_CLASSES}
                        />
                    </label>

                    <label
                        htmlFor="date"
                        className="text-sm font-medium text-slate-700"
                    >
                        Date

                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={prescription.date}
                            onChange={(event) =>
                                onFieldChange('date', event.target.value)
                            }
                            className={INPUT_CLASSES}
                        />
                    </label>

                </div>
            </fieldset>

            <fieldset className="mt-8">
                <legend className="text-sm font-bold uppercase tracking-wide text-slate-700">
                    Clinical details
                </legend>

                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                    {CLINICAL_TEXTAREA_FIELDS.map((field) => (
                        <label
                            key={field.name}
                            htmlFor={field.name}
                            className="text-sm font-medium text-slate-700"
                        >
                            {field.label}

                            <textarea
                                id={field.name}
                                name={field.name}
                                value={prescription[field.name]}
                                onChange={(event) =>
                                    onFieldChange(field.name, event.target.value)
                                }
                                placeholder={field.placeholder}
                                rows={5}
                                className={`${INPUT_CLASSES} resize-y font-bengali`}
                            />
                        </label>
                    ))}
                </div>
            </fieldset>

            <section className="mt-8" aria-labelledby="medicines-heading">
                <div>
                    <h3
                        id="medicines-heading"
                        className="text-sm font-bold uppercase tracking-wide text-slate-700"
                    >
                        Medicines
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Add one row for each prescribed medicine.
                    </p>
                </div>

                <div className="mt-4 space-y-5">
                    {prescription.medicines.map((medicine, index) => (
                        <MedicineRow
                            key={medicine.id}
                            medicine={medicine}
                            rowNumber={index + 1}
                            canRemove={prescription.medicines.length > 1}
                            onChange={onMedicineChange}
                            onRemove={onRemoveMedicine}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onAddMedicine}
                    className="mt-5 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                    + Add next medicine
                </button>
            </section>
            <section
                className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                aria-labelledby="final-instructions-heading"
            >
                <div>
                    <h3
                        id="final-instructions-heading"
                        className="text-sm font-bold uppercase tracking-wide text-slate-700"
                    >
                        Follow-up and Advice
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Complete these after finalizing the medicine list.
                    </p>
                </div>

                <div className="mt-4 grid gap-5 lg:grid-cols-[0.45fr_1.55fr]">
                    <label
                        htmlFor="followUp"
                        className="text-sm font-medium text-slate-700"
                    >
                        Follow-up within

                        <input
                            id="followUp"
                            name="followUp"
                            type="text"
                            value={prescription.followUp}
                            onChange={(event) =>
                                onFieldChange('followUp', event.target.value)
                            }
                            placeholder="1 month"
                            className={INPUT_CLASSES}
                        />
                    </label>

                    <label
                        htmlFor="advice"
                        className="text-sm font-medium text-slate-700"
                    >
                        Advice

                        <textarea
                            id="advice"
                            name="advice"
                            value={prescription.advice}
                            onChange={(event) =>
                                onFieldChange('advice', event.target.value)
                            }
                            placeholder="Enter one instruction per line. Bengali is supported."
                            rows={5}
                            className={`${INPUT_CLASSES} resize-y font-bengali`}
                        />
                    </label>
                </div>
            </section>
        </form>
    )
}

export default PrescriptionForm
