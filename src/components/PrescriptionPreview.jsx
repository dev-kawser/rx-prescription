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

function getHeaderTextClasses(index, alignment) {
    const alignmentClass =
        alignment === 'right' ? 'text-right' : 'text-left'

    if (index === 0) {
        return `${alignmentClass} text-[20px] font-bold leading-tight tracking-[-0.015em] text-red-800`
    }

    if (index === 1 || index === 2) {
        return `${alignmentClass} text-[11px] font-semibold leading-[1.45] text-slate-800`
    }

    if (index === 3) {
        return `${alignmentClass} text-[12px] font-bold leading-[1.45] text-slate-950`
    }

    if (index === 4) {
        return `${alignmentClass} text-[11px] font-semibold leading-[1.45] text-slate-800`
    }

    if (index === 5 || index === 6) {
        return `${alignmentClass} text-[10.5px] font-medium leading-[1.45] text-slate-700`
    }

    return `${alignmentClass} text-[10.5px] font-bold leading-[1.45] text-red-800`
}

function getHeaderRowSpacing(index) {
    if (index === 3 || index === 5 || index === 7) {
        return 'mt-1'
    }

    return ''
}

function getFooterLineClasses(index) {
    if (index === 0) {
        return 'text-[15px] font-bold leading-[1.35] tracking-normal text-red-800'
    }

    if (index === 1) {
        return 'mt-0.5 text-[10.5px] font-bold leading-[1.45] text-slate-950'
    }

    if (index === 2) {
        return 'mt-0.5 text-[10.5px] font-bold leading-[1.45] text-slate-950'
    }

    if (index === 3) {
        return 'mt-0.5 text-[10.5px] font-extrabold leading-[1.45] text-red-800'
    }

    if (index === 4) {
        return 'mt-0.5 text-[10.5px] font-bold leading-[1.45] text-blue-950'
    }

    return 'mt-1 text-[9.5px] font-bold leading-[1.5] text-slate-900'
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
        return null
    }

    return (
        <ul className="mt-3 space-y-2">
            {items.map((item, index) => {
                const isBengali = containsBengali(item)

                return (
                    <li
                        data-print-keep
                        data-pdf-keep
                        key={`${item}-${index}`}
                        lang={isBengali ? 'bn' : undefined}
                        className="flex items-start gap-2.5"
                    >
                        <span
                            aria-hidden="true"
                            className="w-2 shrink-0 text-center text-[12px] font-bold leading-[1.6] text-slate-900"
                        >
                            •
                        </span>

                        <span
                            className={`min-w-0 flex-1 text-[12px] leading-[1.6] text-slate-900 ${isBengali ? 'font-bengali' : ''
                                }`}
                        >
                            {item}
                        </span>
                    </li>
                )
            })}
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
            className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white px-[14mm] py-[12mm] font-sans text-[12.5px] leading-[1.55] text-slate-950 shadow-xl ring-1 ring-slate-300"
        >
            <header
                data-print-keep
                data-pdf-keep
                className="border-b-[2px] border-red-700 pb-4"
            >
                <div className="grid grid-cols-2 items-start gap-12">
                    <section className="min-w-0 text-left">
                        <h1
                            lang="bn"
                            className="font-bengali text-[22px] font-extrabold leading-[1.22] tracking-normal text-red-800"
                        >
                            {DOCTOR_HEADER_ROWS[0].bengali}
                        </h1>

                        <div className="mt-1.5 space-y-0.5">
                            <p
                                lang="bn"
                                className="font-bengali text-[11.5px] font-semibold leading-[1.45] tracking-normal text-slate-800"
                            >
                                {DOCTOR_HEADER_ROWS[1].bengali}
                            </p>

                            <p
                                lang="bn"
                                className="font-bengali text-[11.5px] font-semibold leading-[1.45] tracking-normal text-slate-800"
                            >
                                {DOCTOR_HEADER_ROWS[2].bengali}
                            </p>
                        </div>

                        <div className="mt-2 space-y-0.5">
                            <p
                                lang="bn"
                                className="font-bengali text-[12.5px] font-bold leading-[1.4] tracking-normal text-red-800"
                            >
                                {DOCTOR_HEADER_ROWS[3].bengali}
                            </p>

                            <p
                                lang="bn"
                                className="font-bengali text-[11.5px] font-semibold leading-[1.4] tracking-normal text-slate-900"
                            >
                                {DOCTOR_HEADER_ROWS[4].bengali}
                            </p>
                        </div>

                        <div className="mt-2.5 space-y-0.5">
                            <p
                                lang="bn"
                                className="font-bengali text-[11px] font-semibold leading-[1.45] tracking-normal text-slate-900"
                            >
                                {DOCTOR_HEADER_ROWS[5].bengali}
                            </p>

                            <p
                                lang="bn"
                                className="font-bengali text-[10.5px] font-medium leading-[1.45] tracking-normal text-slate-800"
                            >
                                {DOCTOR_HEADER_ROWS[6].bengali}
                            </p>
                        </div>

                        <p
                            lang="bn"
                            className="mt-2 font-bengali text-[11px] font-bold leading-[1.4] tracking-normal text-red-800"
                        >
                            {DOCTOR_HEADER_ROWS[7].bengali}
                        </p>
                    </section>

                    <section className="min-w-0 text-right">
                        <h1 className="font-serif text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-red-800">
                            {DOCTOR_HEADER_ROWS[0].english}
                        </h1>

                        <div className="mt-1.5 space-y-0.5">
                            <p className="text-[11.5px] font-semibold leading-[1.45] text-slate-800">
                                {DOCTOR_HEADER_ROWS[1].english}
                            </p>

                            <p className="text-[11.5px] font-semibold leading-[1.45] text-slate-800">
                                {DOCTOR_HEADER_ROWS[2].english}
                            </p>
                        </div>

                        <div className="mt-2 space-y-0.5">
                            <p className="text-[12.5px] font-bold leading-[1.4] text-red-800">
                                {DOCTOR_HEADER_ROWS[3].english}
                            </p>

                            <p className="text-[11.5px] font-semibold leading-[1.4] text-slate-900">
                                {DOCTOR_HEADER_ROWS[4].english}
                            </p>
                        </div>

                        <div className="mt-2.5 space-y-0.5">
                            <p className="text-[11px] font-semibold leading-[1.45] text-slate-900">
                                {DOCTOR_HEADER_ROWS[5].english}
                            </p>

                            <p className="text-[10.5px] font-medium leading-[1.45] text-slate-800">
                                {DOCTOR_HEADER_ROWS[6].english}
                            </p>
                        </div>

                        <p className="mt-2 text-[11px] font-bold leading-[1.4] text-red-800">
                            {DOCTOR_HEADER_ROWS[7].english}
                        </p>
                    </section>
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
                        className="min-w-0"
                    >
                        <p
                            className={`text-[12px] ${item.label === 'Name' ? '' : 'whitespace-nowrap'
                                }`}
                        >
                            <span className="font-semibold text-slate-700">
                                {item.label}:
                            </span>

                            {item.value && (
                                <span className="ml-1 font-semibold text-slate-950">
                                    {item.value}
                                </span>
                            )}
                        </p>
                    </div>
                ))}
            </section>

            <div className="mt-5 grid flex-1 grid-cols-[0.9fr_1.4fr] gap-8">
                <aside className="border-r border-slate-300 pr-6">
                    <section>
                        <h2 className="border-b border-slate-300 pb-1 text-[10.5px] font-bold uppercase tracking-[0.075em] text-slate-800">
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

                    {medicines.length > 0 && (
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
                                        className="flex items-start gap-3"
                                    >
                                        <span className="w-7 shrink-0 font-semibold text-slate-950">
                                            {index + 1}.
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                lang={
                                                    containsBengali(medicine.name)
                                                        ? 'bn'
                                                        : undefined
                                                }
                                                className={`text-[13px] font-semibold tracking-[0.01em] text-slate-950 ${containsBengali(medicine.name)
                                                    ? 'font-bengali'
                                                    : ''
                                                    }`}
                                            >
                                                {medicine.name || 'Unnamed medicine'}
                                            </p>

                                            {(dosage || instruction || duration) && (
                                                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-7 gap-y-1 text-[11.5px] leading-5">
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
                                                            className={`font-medium text-slate-700 ${containsBengali(duration)
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
                    )}
                </section>
            </div>

            <section className="mt-8 grid grid-cols-[0.9fr_1.4fr] gap-8 border-t border-slate-300 pt-5">
                <div className="pr-6">
                    <h2 className="text-[13px] font-black uppercase tracking-wide text-black">
                        Follow-up within
                    </h2>

                    {prescription.followUp.trim() && (
                        <p className="mt-2 text-[12px] font-semibold text-slate-900">
                            {prescription.followUp}
                        </p>
                    )}
                </div>

                <div>
                    <h2 className="text-[13px] font-black uppercase tracking-wide text-black">
                        Advice
                    </h2>

                    {renderBulletList(advice)}
                </div>
            </section>

            <footer
                data-print-keep
                data-pdf-keep
                className="mt-auto px-2 pt-8 text-center"
            >
                {CHAMBER_FOOTER_LINES.map((line, index) => (
                    <p
                        key={line}
                        lang="bn"
                        className={`font-bengali tracking-normal ${getFooterLineClasses(index)}`}
                    >
                        {line}
                    </p>
                ))}
            </footer>
        </article>
    )
})

export default PrescriptionPreview
