import { useRef, useState } from 'react'
import PdfDownloadButton from './components/PdfDownloadButton'
import PrescriptionForm from './components/PrescriptionForm'
import PrescriptionPreview from './components/PrescriptionPreview'
import PrintButton from './components/PrintButton'
import usePrescriptionState from './hooks/usePrescriptionState'

function App() {
    const [isCompiled, setIsCompiled] = useState(false)
    const previewRef = useRef(null)

    const {
        prescription,
        updateField,
        updateMedicine,
        addMedicine,
        removeMedicine,
    } = usePrescriptionState()

    function openCompiledView() {
        setIsCompiled(true)
        window.scrollTo({
            top: 0,
            left: 0,
        })
    }

    function returnToEditing() {
        setIsCompiled(false)
        window.scrollTo({
            top: 0,
            left: 0,
        })
    }

    if (isCompiled) {
        return (
            <main className="print-shell min-h-screen bg-slate-200 px-4 py-6 sm:px-6">
                <div className="print-hidden mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            Compiled Prescription
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Review the prescription before printing or downloading it.
                        </p>
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

                <div className="mt-6 flex justify-end">
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
