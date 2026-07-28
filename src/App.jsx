import PrescriptionForm from './components/PrescriptionForm'
import PrescriptionPreview from './components/PrescriptionPreview'
import usePrescriptionState from './hooks/usePrescriptionState'

function App() {
    const {
        prescription,
        updateField,
        updateMedicine,
        addMedicine,
        removeMedicine,
    } = usePrescriptionState()

    return (
        <main className="min-h-screen bg-slate-200 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                        Phase 2
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

                <section className="mt-10">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Live Preview
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Compile, print, and PDF controls will be added later.
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
