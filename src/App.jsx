import { useState } from 'react'

function App() {
    return (
        <main className="min-h-screen bg-slate-100 px-6 py-16">
            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700">
                    Phase 0
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    RxCompile
                </h1>

                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                    The React, Vite, and Tailwind CSS project scaffold is working.
                </p>

                <div className="mt-8 rounded-lg bg-emerald-50 px-5 py-4 text-emerald-800">
                    Tailwind CSS is active.
                </div>
            </section>
        </main>
    )
}

export default App
