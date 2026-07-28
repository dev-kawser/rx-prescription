import {
    useState
} from 'react'

function getTodayAsInputDate() {
    const now = new Date()
    const timezoneOffset = now.getTimezoneOffset() * 60_000
    const localDate = new Date(now.getTime() - timezoneOffset)

    return localDate.toISOString().split('T')[0]
}

function createInitialMedicine() {
    return {
        id: 'medicine-1',
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
        medicines: [createInitialMedicine()],
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

    function updateMedicine(index, field, value) {
        setPrescription((currentPrescription) => ({
            ...currentPrescription,
            medicines: currentPrescription.medicines.map(
                (medicine, medicineIndex) =>
                medicineIndex === index ?
                {
                    ...medicine,
                    [field]: value,
                } :
                medicine,
            ),
        }))
    }

    return {
        prescription,
        updateField,
        updateMedicine,
    }
}

export default usePrescriptionState
