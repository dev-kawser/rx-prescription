import PrescriptionPreview from './components/PrescriptionPreview'

function App() {
    return (
        <main className="min-h-screen bg-slate-200 px-6 py-10">
            <div className="mx-auto mb-6 max-w-[210mm]">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-600">
                    Phase 1
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                    RxCompile Static Prescription Preview
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    This is a static layout preview. Editing and compile controls
                    will be added in later phases.
                </p>
            </div>

            <div className="overflow-x-auto pb-10">
                <PrescriptionPreview />
            </div>
        </main>
    )
}

export default App
