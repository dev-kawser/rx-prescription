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
    const [activeMobilePanel, setActiveMobilePanel] =
        useState('edit')

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
            setActiveMobilePanel('edit')
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
        setActiveMobilePanel('edit')
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
        setActiveMobilePanel('edit')
        scrollToTop()
    }

    if (isCompiled) {
        return (
            <main className="print-shell min-h-screen bg-slate-200 px-3 py-3 sm:px-5 xl:px-6">
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
        <main className="min-h-screen bg-slate-200 px-3 py-5 sm:px-5 xl:px-6">
            <div className="mx-auto max-w-[1600px]">
                <header className="mb-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 font-serif text-2xl font-bold text-red-800"
                        >
                            ℞
                        </div>

                        <div>
                            <h1 className="text-xl font-bold leading-tight text-slate-950">
                                RxCompile
                            </h1>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Digital prescription editor
                            </p>
                        </div>
                    </div>

                    <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
                        Enter patient and medicine details while reviewing the formatted
                        prescription alongside the form.
                    </p>
                </header>

                <div
                    role="tablist"
                    aria-label="Prescription workspace"
                    className="mb-4 grid grid-cols-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm xl:hidden"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeMobilePanel === 'edit'}
                        aria-controls="editor-panel"
                        onClick={() => setActiveMobilePanel('edit')}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${activeMobilePanel === 'edit'
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        Edit Prescription
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeMobilePanel === 'preview'}
                        aria-controls="preview-panel"
                        onClick={() => setActiveMobilePanel('preview')}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${activeMobilePanel === 'preview'
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        Preview
                    </button>
                </div>

                <div className="xl:grid xl:h-[calc(100vh-6.25rem)] xl:grid-cols-[minmax(0,1fr)_520px] xl:items-stretch xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_600px]">
                    <section
                        id="editor-panel"
                        role="tabpanel"
                        className={`min-h-0 ${activeMobilePanel === 'edit' ? 'block' : 'hidden'
                            } xl:flex xl:flex-col`}
                    >
                        <div className="min-h-0 overscroll-contain xl:flex-1 xl:overflow-y-auto xl:pr-3 xl:[scrollbar-gutter:stable] xl:[scrollbar-width:thin] xl:[scrollbar-color:#94a3b8_transparent]">
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
                                    className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 outline-none focus:ring-2 focus:ring-amber-400"
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
                                        Correct these items, or compile anyway when the
                                        missing information is intentional.
                                    </p>
                                </div>
                            )}

                            <div className="h-4" aria-hidden="true" />
                        </div>

                        <div className="mt-4 shrink-0 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
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
                        </div>
                    </section>

                    <aside
                        id="preview-panel"
                        role="tabpanel"
                        className={`min-h-0 ${activeMobilePanel === 'preview' ? 'block' : 'hidden'
                            } xl:block`}
                    >
                        <div className="flex min-h-[65vh] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm xl:h-full xl:min-h-0">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Live Preview
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Updates automatically as you type.
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    A4
                                </span>
                            </div>

                            <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-300 p-3 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:#94a3b8_#cbd5e1] sm:p-4">
                                <div className="mx-auto w-[210mm] [zoom:0.42] sm:[zoom:0.55] lg:[zoom:0.62] xl:[zoom:0.6] 2xl:[zoom:0.68]">
                                    <PrescriptionPreview prescription={prescription} />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default App
