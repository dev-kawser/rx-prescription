import {
    CHAMBER_FOOTER_LINES,
    DOCTOR_HEADER_ROWS,
    RX_SYMBOL,
} from '../data/letterhead'

const SAMPLE_PRESCRIPTION = Object.freeze({
    patientName: 'Sample Patient',
    age: '42y',
    gender: 'Male',
    weight: '68 kg',
    date: '29 July 2026',

    complaints: Object.freeze([
        'Fever for 3 days',
        'Dry cough',
        'General weakness',
    ]),

    diagnosis: Object.freeze([
        'Acute upper respiratory tract infection',
    ]),

    investigations: Object.freeze([
        'Complete blood count',
        'Chest X-ray if symptoms persist',
    ]),

    medicines: Object.freeze([
        Object.freeze({
            name: 'Tab. Rupadin 10 mg (Rupatadine Fumarate)',
            dosage: '0+0+1',
            duration: '2 months',
        }),
        Object.freeze({
            name: 'Tab. Napa 500 mg',
            dosage: '1+0+1',
            duration: '5 days',
        }),
        Object.freeze({
            name: 'Syp. Ambrox',
            dosage: '2 tsp three times daily',
            duration: '7 days',
        }),
    ]),

    followUp: '1 month',

    advice: Object.freeze([
        'Drink adequate water.',
        'Take sufficient rest.',
        'জ্বর বা শ্বাসকষ্ট বেড়ে গেলে দ্রুত হাসপাতালে যোগাযোগ করবেন।',
    ]),
})

function PrescriptionPreview() {
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
                <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Patient name
                    </p>
                    <p className="mt-1 border-b border-dotted border-slate-500 pb-1 font-semibold">
                        {SAMPLE_PRESCRIPTION.patientName}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Age
                    </p>
                    <p className="mt-1 border-b border-dotted border-slate-500 pb-1">
                        {SAMPLE_PRESCRIPTION.age}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Gender
                    </p>
                    <p className="mt-1 border-b border-dotted border-slate-500 pb-1">
                        {SAMPLE_PRESCRIPTION.gender}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Weight
                    </p>
                    <p className="mt-1 border-b border-dotted border-slate-500 pb-1">
                        {SAMPLE_PRESCRIPTION.weight}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Date
                    </p>
                    <p className="mt-1 border-b border-dotted border-slate-500 pb-1">
                        {SAMPLE_PRESCRIPTION.date}
                    </p>
                </div>
            </section>

            <div className="mt-5 grid flex-1 grid-cols-[0.9fr_1.4fr] gap-8">
                <aside className="border-r border-slate-300 pr-6">
                    <section>
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Chief Complaints
                        </h2>

                        <ul className="mt-3 list-disc space-y-1 pl-5">
                            {SAMPLE_PRESCRIPTION.complaints.map((complaint) => (
                                <li key={complaint}>{complaint}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mt-8">
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Diagnosis
                        </h2>

                        <ul className="mt-3 list-disc space-y-1 pl-5">
                            {SAMPLE_PRESCRIPTION.diagnosis.map((diagnosis) => (
                                <li key={diagnosis}>{diagnosis}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mt-8">
                        <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            Investigations
                        </h2>

                        <ul className="mt-3 list-disc space-y-1 pl-5">
                            {SAMPLE_PRESCRIPTION.investigations.map((investigation) => (
                                <li key={investigation}>{investigation}</li>
                            ))}
                        </ul>
                    </section>
                </aside>

                <section aria-label="Medicines">
                    <div className="text-5xl leading-none text-red-800">
                        {RX_SYMBOL}
                    </div>

                    <ol className="mt-7 space-y-5">
                        {SAMPLE_PRESCRIPTION.medicines.map((medicine, index) => (
                            <li
                                key={`${medicine.name}-${medicine.dosage}`}
                                className="flex items-start gap-2"
                            >
                                <span className="w-6 shrink-0 font-bold">
                                    {index + 1}.
                                </span>

                                <div>
                                    <p className="font-semibold">
                                        {medicine.name}
                                    </p>

                                    <p className="mt-1 text-slate-700">
                                        {medicine.dosage}
                                        <span className="px-2">—</span>
                                        {medicine.duration}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            <section className="mt-8 grid grid-cols-[0.9fr_1.4fr] gap-8 border-t border-slate-300 pt-5">
                <div className="pr-6">
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                        Follow-up within
                    </h2>

                    <p className="mt-2 font-semibold">
                        {SAMPLE_PRESCRIPTION.followUp}
                    </p>
                </div>

                <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                        Advice
                    </h2>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        {SAMPLE_PRESCRIPTION.advice.map((item) => (
                            <li
                                key={item}
                                lang={/[\u0980-\u09FF]/.test(item) ? 'bn' : undefined}
                                className={
                                    /[\u0980-\u09FF]/.test(item)
                                        ? 'font-bengali'
                                        : undefined
                                }
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <div className="min-h-28" aria-hidden="true" />

            <footer className="border-t-2 border-red-700 pt-4 text-center text-[11px] leading-5 text-red-700">
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
