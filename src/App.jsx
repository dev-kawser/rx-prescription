import { useEffect, useRef, useState } from 'react'
import PdfDownloadButton from './components/PdfDownloadButton'
import PrescriptionForm from './components/PrescriptionForm'
import PrescriptionPreview from './components/PrescriptionPreview'
import PrintButton from './components/PrintButton'
import usePrescriptionState from './hooks/usePrescriptionState'

const MEDICINE_CONTENT_FIELDS = [
    'name',
    'morning',
    'noon',
    'night',
    'duration',
    'instruction',
]

function medicineHasContent(medicine) {
    return MEDICINE_CONTENT_FIELDS.some((field) =>
        String(medicine[field] ?? '').trim(),
    )
}

function getCompileWarnings(prescription) {
    const warnings = []

    if (!prescription.patientName.trim()) {
        warnings.push('Patient Name is empty.')
    }

    if (!prescription.medicines.some(medicineHasContent)) {
        warnings.push('No medicine details have been entered.')
    }

    return warnings
}

function App() {
    const [isCompiled, setIsCompiled] = useState(false)
    const [compileWarnings, setCompileWarnings] = useState([])

    const previewRef = useRef(null)
    const warningRef = useRef(null)

    const {
        prescription,
        updateField,
        updateMedicine,
        addMedicine,
        removeMedicine,
        resetPrescription,
    } = usePrescriptionState()

    useEffect(() => {
        if (!isCompiled && compileWarnings.length > 0) {
            warningRef.current?.focus()
        }
    }, [compileWarnings, isCompiled])

    useEffect(() => {
        setCompileWarnings([])
    }, [prescription])

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
        })
    }

    function showCompiledView() {
        setIsCompiled(true)
        scrollToTop()
    }

    function openCompiledView() {
        const warnings = getCompileWarnings(prescription)

        if (warnings.length > 0) {
            setCompileWarnings(warnings)
            return
        }

        setCompileWarnings([])
        showCompiledView()
    }

    function compileAnyway() {
        showCompiledView()
    }

    function returnToEditing() {
        setIsCompiled(false)
        scrollToTop()
    }

    function clearForm() {
        const shouldClear = window.confirm(
            'Clear all entered prescription data? This cannot be undone.',
        )

        if (!shouldClear) {
            return
        }

        resetPrescription()
        setCompileWarnings([])
        scrollToTop()
    }

    if (isCompiled) {
        return (
            <main className="print-shell min-h-screen bg-slate-200 px-4 py-6 sm:px-6">
                <div className="print-hidden mx-auto mb-5 flex max-w-[210mm] flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold text-slate-900">
                            Compiled Prescription
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Review the prescription before printing or downloading it.
                        </p>

                        {compileWarnings.length > 0 && (
                            <div
                                role="status"
                                className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                            >
                                <p className="font-semibold">
                                    Compiled with incomplete information:
                                </p>

                                <ul className="mt-1 list-disc pl-5">
                                    {compileWarnings.map((warning) => (
                                        <li key={warning}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={returnToEditing}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                        >
                            Back to edit
                        </button>

                        <PrintButton />

                        <PdfDownloadButton
                            targetRef={previewRef}
                            patientName={prescription.patientName}
                            date={prescription.date}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto pb-10">
                    <PrescriptionPreview
                        ref={previewRef}
                        prescription={prescription}
                    />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-200 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                        Prescription Editor
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        RxCompile
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Enter patient information and review the live prescription
                        preview below.
                    </p>
                </header>

                <PrescriptionForm
                    prescription={prescription}
                    onFieldChange={updateField}
                    onMedicineChange={updateMedicine}
                    onAddMedicine={addMedicine}
                    onRemoveMedicine={removeMedicine}
                />

                {compileWarnings.length > 0 && (
                    <div
                        ref={warningRef}
                        tabIndex="-1"
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        <h2 className="font-bold">
                            Review before compiling
                        </h2>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                            {compileWarnings.map((warning) => (
                                <li key={warning}>{warning}</li>
                            ))}
                        </ul>

                        <p className="mt-3 text-sm">
                            Correct these items, or use Compile anyway if the missing
                            information is intentional.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="rounded-lg border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                    >
                        Clear form
                    </button>

                    {compileWarnings.length > 0 && (
                        <button
                            type="button"
                            onClick={compileAnyway}
                            className="rounded-lg border border-amber-500 bg-amber-100 px-5 py-3 text-sm font-bold text-amber-950 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                        >
                            Compile anyway
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={openCompiledView}
                        className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    >
                        Compile Prescription
                    </button>
                </div>

                <section className="mt-10">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Live Preview
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            The compiled view removes the editing interface.
                        </p>
                    </div>

                    <div className="overflow-x-auto pb-10">
                        <PrescriptionPreview prescription={prescription} />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default App
