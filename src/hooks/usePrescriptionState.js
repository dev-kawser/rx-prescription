import { useState } from 'react'

function getTodayAsInputDate() {
    const now = new Date()
    const timezoneOffset = now.getTimezoneOffset() * 60_000
    const localDate = new Date(now.getTime() - timezoneOffset)

    return localDate.toISOString().split('T')[0]
}

function createMedicineId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID()
    }

    return `medicine-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`
}

export function createEmptyMedicine() {
    return {
        id: createMedicineId(),
        name: '',
        morning: '',
        noon: '',
        night: '',
        duration: '',
        instruction: '',
    }
}

export function createInitialPrescription() {
    return {
        patientName: '',
        age: '',
        gender: '',
        weight: '',
        date: getTodayAsInputDate(),
        complaints: '',
        diagnosis: '',
        investigations: '',
        medicines: [createEmptyMedicine()],
        followUp: '',
        advice: '',
    }
}

function usePrescriptionState() {
    const [prescription, setPrescription] = useState(
        createInitialPrescription,
    )

    function updateField(field, value) {
        setPrescription((currentPrescription) => ({
            ...currentPrescription,
            [field]: value,
        }))
    }

    function updateMedicine(medicineId, field, value) {
        setPrescription((currentPrescription) => ({
            ...currentPrescription,
            medicines: currentPrescription.medicines.map((medicine) =>
                medicine.id === medicineId
                    ? {
                        ...medicine,
                        [field]: value,
                    }
                    : medicine,
            ),
        }))
    }

    function addMedicine() {
        setPrescription((currentPrescription) => ({
            ...currentPrescription,
            medicines: [
                ...currentPrescription.medicines,
                createEmptyMedicine(),
            ],
        }))
    }

    function removeMedicine(medicineId) {
        setPrescription((currentPrescription) => {
            if (currentPrescription.medicines.length === 1) {
                return currentPrescription
            }

            return {
                ...currentPrescription,
                medicines: currentPrescription.medicines.filter(
                    (medicine) => medicine.id !== medicineId,
                ),
            }
        })
    }

    function resetPrescription() {
        setPrescription(createInitialPrescription())
    }

    return {
        prescription,
        updateField,
        updateMedicine,
        addMedicine,
        removeMedicine,
        resetPrescription,
    }
}

export default usePrescriptionState
