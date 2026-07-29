/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],

    theme: {
        extend: {
            colors: {
                clinical: {
                    50: '#EAF5F4',
                    100: '#D5EBE9',
                    200: '#ADD7D4',
                    300: '#7FBDB9',
                    400: '#4F9E99',
                    500: '#2F817D',
                    600: '#176B68',
                    700: '#145B58',
                    800: '#104C4A',
                    900: '#0B3735',
                },

                ink: {
                    900: '#182230',
                    700: '#344054',
                    500: '#667085',
                    400: '#98A2B3',
                },

                mineral: {
                    50: '#F7F9F8',
                    100: '#EDF2F1',
                    200: '#DCE5E3',
                    300: '#C7D4D1',
                },

                signal: {
                    50: '#FDF2F0',
                    100: '#F9E1DC',
                    600: '#B5473A',
                    700: '#963B31',
                },
            },

            fontFamily: {
                sans: [
                    'ui-sans-serif',
                    'system-ui',
                    '"Segoe UI"',
                    'sans-serif',
                ],

                bengali: [
                    '"Noto Sans Bengali"',
                    '"Nirmala UI"',
                    'Vrinda',
                    'sans-serif',
                ],
            },

            borderRadius: {
                control: '9px',
                section: '12px',
                panel: '16px',
            },

            boxShadow: {
                panel:
                    '0 1px 2px rgba(24, 34, 48, 0.04), 0 8px 24px rgba(24, 34, 48, 0.05)',

                float:
                    '0 8px 28px rgba(24, 34, 48, 0.10), 0 2px 8px rgba(24, 34, 48, 0.05)',

                focus:
                    '0 0 0 3px rgba(23, 107, 104, 0.18)',
            },
        },
    },

    plugins: [],
}
