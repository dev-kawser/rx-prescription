import { useState } from 'react'
import { exportPrescriptionToPdf } from '../utils/pdfExport'

function PdfDownloadButton({
    targetRef,
    patientName,
    date,
}) {
    const [isExporting, setIsExporting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    async function handleDownload() {
        if (!targetRef.current || isExporting) {
            return
        }

        setIsExporting(true)
        setErrorMessage('')

        try {
            await exportPrescriptionToPdf(targetRef.current, {
                patientName,
                date,
            })
        } catch {
            setErrorMessage(
                'The PDF could not be created. Please try printing instead.',
            )
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                aria-busy={isExporting}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-wait disabled:bg-blue-400"
            >
                {isExporting ? 'Creating PDF…' : 'Download PDF'}
            </button>

            {errorMessage && (
                <p
                    role="alert"
                    className="mt-2 max-w-64 text-xs font-medium text-red-700"
                >
                    {errorMessage}
                </p>
            )}
        </div>
    )
}

export default PdfDownloadButton
