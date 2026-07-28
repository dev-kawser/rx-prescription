import {
    CHAMBER_FOOTER_LINES,
    DOCTOR_HEADER_ROWS,
    RX_SYMBOL,
} from '../data/letterhead'

function splitLines(value) {
    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
}

function containsBengali(value) {
    return /[\u0980-\u09FF]/.test(value)
}

function formatDate(value) {
    if (!value) {
        return '—'
    }

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)
}

function formatDosage(medicine) {
    const dosageParts = [
        medicine.morning,
        medicine.noon,
        medicine.night,
    ].map((part) => part.trim())

    if (dosageParts.every((part) => !part)) {
        return ''
    }

    return dosageParts
        .map((part) => part || '0')
        .join('+')
}

function renderBulletList(items) {
    if (items.length === 0) {
        return <p className="mt-3 text-slate-400">—</p>
    }

    return (
        <ul className="mt-3 list-disc space-y-1 pl-5">
            {items.map((item, index) => (
                <li
                    key={`${item}-${index}`}
                    lang={containsBengali(item) ? 'bn' : undefined}
                    className={containsBengali(item) ? 'font-bengali' : undefined}
                >
                    {item}
                </li>
            ))}
        </ul>
    )
}

function PrescriptionPreview({ prescription }) {
    const complaints = splitLines(prescription.complaints)
    const diagnosis = splitLines(prescription.diagnosis)
    const investigations = splitLines(prescription.investigations)
    const advice = splitLines(prescription.advice)

    const medicines = prescription.medicines.filter((medicine) =>
        [
            medicine.name,
            medicine.morning,
            medicine.noon,
            medicine.night,
            medicine.duration,
            medicine.instruction,
        ].some((value) => value.trim()),
    )

    const patientInformation = [
        {
            label: 'Patient name',
            value: prescription.patientName,
            width: 'col-span-2',
        },
        {
            label: 'Age',
            value: prescription.age,
            width: '',
        },
        {
            label: 'Gender',
            value: prescription.gender,
            width: '',
        },
        {
            label: 'Weight',
            value: prescription.weight,
            width: '',
        },
        {
            label: 'Date',
            value: formatDate(prescription.date),
            width: '',
        },
    ]

    return (
        <article className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white px-[14mm] py-[12mm] text-[13px] leading-relaxed text-slate-900 shadow-xl ring-1 ring-slate-300">
            <header className="border-b-2 border-red-700 pb-4">
                <div className="space-y-1">
                    {DOCTOR_HEADER_ROWS.map((row, index) => (
                        <div
                            key={`${row.bengali}-${row.english}`}
                            className="grid grid-cols-2 gap-8"
                        >
                            <p
                                lang="bn"
                                className={`font-bengali ${index === 0
                                        ? 'text-[21px] font-bold text-red-800'
                                        : 'text-[12px] font-medium'
                                    }`}
                            >
                                {row.bengali}
                            </p>

                            <p
                                className={`text-right ${index === 0
                                        ? 'text-[21px] font-bold text-red-800'
                                        : 'text-[12px] font-medium'
                                    }`}
                            >
                                {row.english}
                            </p>
                        </div>
                    ))}
                </div>
            </header>

            <section
                aria-label="Patient information"
                className="mt-4 grid grid-cols-6 gap-x-5 border-b border-slate-400 pb-3"
            >
                {patientInformation.map((item) => (
                    <div key={item.label} className={item.width}>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {item.label}
                        </p>

                        <p className="mt-1 border-b border-dotted border-slate-500 pb-1 font-semibold">
                            {item.value || '—'}
                        </p>
                    </div>
                ))}
            </section>

            <div className="mt-5 grid flex-1 grid-cols-[0.9fr_1.4fr] gap-8">
                <aside className="border-r border-slate-300 pr-6">
                    <section>
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Chief Complaints
                        </h2>

                        {renderBulletList(complaints)}
                    </section>

                    <section className="mt-8">
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Diagnosis
                        </h2>

                        {renderBulletList(diagnosis)}
                    </section>

                    <section className="mt-8">
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Investigations
                        </h2>

                        {renderBulletList(investigations)}
                    </section>
                </aside>

                <section aria-label="Medicines">
                    <div className="text-5xl leading-none text-red-800">
                        {RX_SYMBOL}
                    </div>

                    {medicines.length > 0 ? (
                        <ol className="mt-7 space-y-5">
                            {medicines.map((medicine, index) => {
                                const dosage = formatDosage(medicine)
                                const dosageAndDuration = [
                                    dosage,
                                    medicine.duration.trim(),
                                ]
                                    .filter(Boolean)
                                    .join(' — ')

                                return (
                                    <li
                                        key={medicine.id}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="w-6 shrink-0 font-bold">
                                            {index + 1}.
                                        </span>

                                        <div>
                                            <p
                                                lang={
                                                    containsBengali(medicine.name)
                                                        ? 'bn'
                                                        : undefined
                                                }
                                                className={`font-semibold ${containsBengali(medicine.name)
                                                        ? 'font-bengali'
                                                        : ''
                                                    }`}
                                            >
                                                {medicine.name || 'Unnamed medicine'}
                                            </p>

                                            {dosageAndDuration && (
                                                <p className="mt-1 text-slate-700">
                                                    {dosageAndDuration}
                                                </p>
                                            )}

                                            {medicine.instruction.trim() && (
                                                <p
                                                    lang={
                                                        containsBengali(medicine.instruction)
                                                            ? 'bn'
                                                            : undefined
                                                    }
                                                    className={`mt-1 text-xs italic text-slate-600 ${containsBengali(medicine.instruction)
                                                            ? 'font-bengali'
                                                            : ''
                                                        }`}
                                                >
                                                    {medicine.instruction}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    ) : (
                        <p className="mt-7 text-slate-400">—</p>
                    )}
                </section>
            </div>

            <section className="mt-8 grid grid-cols-[0.9fr_1.4fr] gap-8 border-t border-slate-300 pt-5">
                <div className="pr-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                        Follow-up within
                    </h2>

                    <p className="mt-2 font-semibold">
                        {prescription.followUp || '—'}
                    </p>
                </div>

                <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                        Advice
                    </h2>

                    {renderBulletList(advice)}
                </div>
            </section>

            <footer className="mt-8 border-t-2 border-red-700 pt-4 text-center text-[11px] leading-5 text-red-700">
                {CHAMBER_FOOTER_LINES.map((line, index) => (
                    <p
                        key={line}
                        lang="bn"
                        className={`font-bengali ${index === 0 ? 'text-sm font-bold' : 'font-medium'
                            }`}
                    >
                        {line}
                    </p>
                ))}
            </footer>
        </article>
    )
}

export default PrescriptionPreview
