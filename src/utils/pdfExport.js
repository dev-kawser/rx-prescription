import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

function sanitizeFilenamePart(value, fallback) {
    const cleanedValue = String(value ?? '')
        .trim()
        .normalize('NFKC')
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^\.+|\.+$/g, '')

    return cleanedValue || fallback
}

function createFilename(patientName, date) {
    const safePatientName = sanitizeFilenamePart(
        patientName,
        'patient',
    )

    const safeDate = sanitizeFilenamePart(date, 'undated')

    return `prescription-${safePatientName}-${safeDate}.pdf`
}

function getKeepTogetherBlocks(element, canvas) {
    const elementRect = element.getBoundingClientRect()

    if (elementRect.width === 0 || elementRect.height === 0) {
        return []
    }

    const horizontalScale = canvas.width / elementRect.width
    const verticalScale = canvas.height / elementRect.height

    return Array.from(
        element.querySelectorAll('[data-pdf-keep]'),
    ).map((block) => {
        const blockRect = block.getBoundingClientRect()

        return {
            top: Math.max(
                0,
                Math.round(
                    (blockRect.top - elementRect.top) * verticalScale,
                ),
            ),
            bottom: Math.min(
                canvas.height,
                Math.round(
                    (blockRect.bottom - elementRect.top) * verticalScale,
                ),
            ),
            width: Math.round(blockRect.width * horizontalScale),
        }
    })
}

function choosePageEnd({
    pageStart,
    idealPageEnd,
    canvasHeight,
    pageHeightPixels,
    keepTogetherBlocks,
}) {
    if (idealPageEnd >= canvasHeight) {
        return canvasHeight
    }

    const crossingBlocks = keepTogetherBlocks.filter(
        (block) =>
            block.top > pageStart &&
            block.top < idealPageEnd &&
            block.bottom > idealPageEnd,
    )

    if (crossingBlocks.length === 0) {
        return idealPageEnd
    }

    const earliestCrossingBlock = crossingBlocks.reduce(
        (earliestBlock, currentBlock) =>
            currentBlock.top < earliestBlock.top
                ? currentBlock
                : earliestBlock,
    )

    const blockHeight =
        earliestCrossingBlock.bottom - earliestCrossingBlock.top

    const adjustedPageEnd = earliestCrossingBlock.top

    const createsEmptyPage = adjustedPageEnd <= pageStart
    const blockCannotFitOnOnePage = blockHeight >= pageHeightPixels

    if (createsEmptyPage || blockCannotFitOnOnePage) {
        return idealPageEnd
    }

    return adjustedPageEnd
}

function createPageCanvas(sourceCanvas, startY, endY) {
    const pageCanvas = document.createElement('canvas')
    const pageHeight = Math.max(1, endY - startY)

    pageCanvas.width = sourceCanvas.width
    pageCanvas.height = pageHeight

    const context = pageCanvas.getContext('2d')

    if (!context) {
        throw new Error('The browser could not create a PDF canvas.')
    }

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, pageCanvas.width, pageCanvas.height)

    context.drawImage(
        sourceCanvas,
        0,
        startY,
        sourceCanvas.width,
        pageHeight,
        0,
        0,
        sourceCanvas.width,
        pageHeight,
    )

    return pageCanvas
}

export async function exportPrescriptionToPdf(
    element,
    {
        patientName = '',
        date = '',
    } = {},
) {
    if (!(element instanceof HTMLElement)) {
        throw new Error('The prescription preview is not available.')
    }

    if (document.fonts?.ready) {
        await document.fonts.ready
    }

    const captureWidth = element.scrollWidth
    const captureHeight = element.scrollHeight

    const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        width: captureWidth,
        height: captureHeight,
        windowWidth: Math.max(
            document.documentElement.clientWidth,
            captureWidth,
        ),
        windowHeight: Math.max(
            document.documentElement.clientHeight,
            captureHeight,
        ),
        onclone: (clonedDocument) => {
            const clonedPreview = clonedDocument.querySelector(
                '[data-prescription-preview]',
            )

            if (clonedPreview) {
                clonedPreview.style.margin = '0'
                clonedPreview.style.boxShadow = 'none'
                clonedPreview.style.outline = 'none'
            }
        },
    })

    if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('The prescription could not be rendered.')
    }

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    })

    const pageHeightPixels = Math.floor(
        canvas.width * (A4_HEIGHT_MM / A4_WIDTH_MM),
    )

    const keepTogetherBlocks = getKeepTogetherBlocks(
        element,
        canvas,
    )

    let pageStart = 0
    let pageNumber = 0

    while (pageStart < canvas.height) {
        const idealPageEnd = Math.min(
            pageStart + pageHeightPixels,
            canvas.height,
        )

        let pageEnd = choosePageEnd({
            pageStart,
            idealPageEnd,
            canvasHeight: canvas.height,
            pageHeightPixels,
            keepTogetherBlocks,
        })

        if (pageEnd <= pageStart) {
            pageEnd = idealPageEnd
        }

        const pageCanvas = createPageCanvas(
            canvas,
            pageStart,
            pageEnd,
        )

        const renderedHeightMm =
            (pageCanvas.height / pageCanvas.width) * A4_WIDTH_MM

        const pageImage = pageCanvas.toDataURL('image/png')

        if (pageNumber > 0) {
            pdf.addPage('a4', 'portrait')
        }

        pdf.addImage(
            pageImage,
            'PNG',
            0,
            0,
            A4_WIDTH_MM,
            renderedHeightMm,
            undefined,
            'FAST',
        )

        pageStart = pageEnd
        pageNumber += 1
    }

    pdf.save(createFilename(patientName, date))
}
