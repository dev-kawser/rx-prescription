import BulletEntryField from './BulletEntryField'
import MedicineRow from './MedicineRow'

const INPUT_CLASSES =
    'mt-2 h-11 w-full rounded-control border border-mineral-300 bg-white px-3.5 text-sm font-medium text-ink-900 outline-none transition duration-150 placeholder:font-normal placeholder:text-ink-400 hover:border-clinical-300 focus:border-clinical-600 focus:ring-4 focus:ring-clinical-100 disabled:cursor-not-allowed disabled:bg-mineral-100 disabled:text-ink-400'

const LABEL_CLASSES =
    'block text-sm font-semibold leading-5 text-ink-700'

const SECTION_CLASSES =
    'mt-6 rounded-section border border-mineral-200 border-l-[3px] border-l-clinical-600 bg-mineral-50/70 p-4 sm:p-5'

const SECTION_TITLE_CLASSES =
    'px-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-700'

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
            className="rounded-panel border border-mineral-200 bg-white p-4 shadow-panel sm:p-6"
        >
            <div className="border-b border-mineral-200 pb-5">
                <h2 className="text-lg font-bold tracking-[-0.01em] text-ink-900">
                    Prescription Details
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-ink-500">
                    Changes appear immediately in the prescription preview.
                </p>
            </div>

            <fieldset className={SECTION_CLASSES}>
                <legend className={SECTION_TITLE_CLASSES}>
                    Patient information
                </legend>

                <div className="mt-3 grid gap-x-4 gap-y-5 md:grid-cols-2 2xl:grid-cols-3">
                    <label
                        htmlFor="patientName"
                        className={LABEL_CLASSES}
                    >
                        Patient Name
                        <span
                            aria-hidden="true"
                            className="ml-1 text-signal-600"
                        >
                            *
                        </span>

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
                        className={LABEL_CLASSES}
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
                        className={LABEL_CLASSES}
                    >
                        Gender

                        <select
                            id="gender"
                            name="gender"
                            value={prescription.gender}
                            onChange={(event) =>
                                onFieldChange('gender', event.target.value)
                            }
                            className={`${INPUT_CLASSES} cursor-pointer`}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label
                        htmlFor="weight"
                        className={LABEL_CLASSES}
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
                        className={LABEL_CLASSES}
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
                            className={`${INPUT_CLASSES} cursor-pointer`}
                        />
                    </label>
                </div>
            </fieldset>

            <fieldset className={SECTION_CLASSES}>
                <legend className={SECTION_TITLE_CLASSES}>
                    Clinical details
                </legend>

                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                    <BulletEntryField
                        id="complaints"
                        label="Chief Complaints"
                        value={prescription.complaints}
                        onChange={(value) =>
                            onFieldChange('complaints', value)
                        }
                        placeholder="Enter the complaint"
                        addLabel="Add complaint"
                    />

                    <BulletEntryField
                        id="diagnosis"
                        label="Diagnosis"
                        value={prescription.diagnosis}
                        onChange={(value) =>
                            onFieldChange('diagnosis', value)
                        }
                        placeholder="Enter the diagnosis"
                        addLabel="Add diagnosis"
                    />

                    <div className="lg:col-span-2">
                        <BulletEntryField
                            id="investigations"
                            label="Investigations"
                            value={prescription.investigations}
                            onChange={(value) =>
                                onFieldChange('investigations', value)
                            }
                            placeholder="Enter the investigation"
                            addLabel="Add investigation"
                        />
                    </div>
                </div>
            </fieldset>

            <section
                className={SECTION_CLASSES}
                aria-labelledby="medicines-heading"
            >
                <div>
                    <h3
                        id="medicines-heading"
                        className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-700"
                    >
                        Medicines
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-ink-500">
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
                    className="mt-5 flex min-h-11 w-full items-center justify-center rounded-section border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition duration-150 hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                    + Add next medicine
                </button>
            </section>

            <section
                className={SECTION_CLASSES}
                aria-labelledby="final-instructions-heading"
            >
                <div>
                    <h3
                        id="final-instructions-heading"
                        className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-700"
                    >
                        Follow-up and Advice
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-ink-500">
                        Complete these after finalizing the medicine list.
                    </p>
                </div>

                <div className="mt-5 max-w-sm">
                    <label
                        htmlFor="followUp"
                        className={LABEL_CLASSES}
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
                </div>

                <div className="mt-5 border-t border-mineral-200 pt-5">
                    <BulletEntryField
                        id="advice"
                        label="Advice"
                        value={prescription.advice}
                        onChange={(value) =>
                            onFieldChange('advice', value)
                        }
                        placeholder="Enter the advice or instruction"
                        addLabel="Add advice"
                        variant="embedded"
                        showEmptyState={false}
                    />
                </div>
            </section>
        </form>
    )
}

export default PrescriptionForm
