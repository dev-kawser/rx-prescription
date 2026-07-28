function PrintButton() {
    function handlePrint() {
        window.print()
    }

    return (
        <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
            Print
        </button>
    )
}

export default PrintButton
