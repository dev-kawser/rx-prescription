import { forwardRef } from 'react'
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
                    data-print-keep
                    data-pdf-keep
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

const PrescriptionPreview = forwardRef(function PrescriptionPreview(
    { prescription },
    ref,
) {
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
            label: 'Name',
            value: prescription.patientName,
        },
        {
            label: 'Age',
            value: prescription.age,
        },
        {
            label: 'Gender',
            value: prescription.gender,
        },
        {
            label: 'Weight',
            value: prescription.weight,
        },
        {
            label: 'Date',
            value: formatDate(prescription.date),
        },
    ]

    return (
        <article
            ref={ref}
            data-prescription-preview
            className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white px-[14mm] py-[12mm] text-[13px] leading-relaxed text-slate-900 shadow-xl ring-1 ring-slate-300"
        >
            <header
                data-print-keep
                data-pdf-keep
                className="border-b-2 border-red-700 pb-4"
            >
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
                data-print-keep
                data-pdf-keep
                aria-label="Patient information"
                className="mt-4 grid grid-cols-[2.2fr_0.65fr_0.95fr_0.75fr_1.35fr] gap-x-4 border-b border-slate-400 pb-3"
            >
                {patientInformation.map((item) => (
                    <div
                        key={item.label}
                        className={`min-w-0 ${item.width}`}
                    >
                        <p className=" border-slate-500 pb-1">
                            <span className="font-bold text-slate-700">
                                {item.label}:
                            </span>{' '}

                            <span className="font-semibold text-slate-900">
                                {item.value || '—'}
                            </span>
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
                                const instruction = medicine.instruction.trim()
                                const duration = medicine.duration.trim()

                                return (
                                    <li
                                        data-print-keep
                                        data-pdf-keep
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

                                            {(dosage || instruction || duration) && (
                                                <div className="mt-1 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[12px] text-slate-700">
                                                    {dosage && (
                                                        <span className="font-medium text-slate-800">
                                                            {dosage}
                                                        </span>
                                                    )}

                                                    {instruction && (
                                                        <span
                                                            lang={
                                                                containsBengali(instruction)
                                                                    ? 'bn'
                                                                    : undefined
                                                            }
                                                            className={`italic text-slate-600 ${containsBengali(instruction)
                                                                    ? 'font-bengali'
                                                                    : ''
                                                                }`}
                                                        >
                                                            {instruction}
                                                        </span>
                                                    )}

                                                    {duration && (
                                                        <span
                                                            lang={
                                                                containsBengali(duration)
                                                                    ? 'bn'
                                                                    : undefined
                                                            }
                                                            className={`text-slate-700 ${containsBengali(duration)
                                                                    ? 'font-bengali'
                                                                    : ''
                                                                }`}
                                                        >
                                                            {duration}
                                                        </span>
                                                    )}
                                                </div>
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

            <footer
                data-print-keep
                data-pdf-keep
                className="mt-8 border-t-2 border-red-700 pt-4 text-center text-[11px] leading-5 text-red-700"
            >
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
})

export default PrescriptionPreview
