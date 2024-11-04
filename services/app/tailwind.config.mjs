/** @type {import('tailwindcss').Config} */
export default {
    content: ["./**/*.{tsx,html}"],
    darkMode: "selector",
    theme: {
        colors: {
            text: {
                dark: "#f8f6f1",
                light: "#0e0c07",
                50: "#f6f4ee",
                100: "#eee9dd",
                200: "#ddd3bb",
                300: "#ccbd99",
                400: "#bba877",
                500: "#aa9255",
                600: "#887544",
                700: "#665733",
                800: "#443a22",
                900: "#221d11",
                950: "#110f09",
            },
            background: {
                dark: "#070603",
                light: "#fcfbf8",
                50: "#f7f5ed",
                100: "#f0ebdb",
                200: "#e0d6b8",
                300: "#d1c294",
                400: "#c2ad70",
                500: "#b3994d",
                600: "#8f7a3d",
                700: "#6b5c2e",
                800: "#473d1f",
                900: "#241f0f",
                950: "#120f08",
            },
            primary: {
                dark: "#9d8948",
                light: "#b7a362",
                50: "#f7f5ee",
                100: "#efebdc",
                200: "#dfd6b9",
                300: "#cfc296",
                400: "#bfad73",
                500: "#af9950",
                600: "#8c7a40",
                700: "#695c30",
                800: "#463d20",
                900: "#231f10",
                950: "#110f08",
            },
            secondary: {
                dark: "#575e2c",
                light: "#ccd3a1",
                50: "#f6f7ee",
                100: "#ecefdc",
                200: "#d9deba",
                300: "#c7ce97",
                400: "#b4be74",
                500: "#a1ad52",
                600: "#818b41",
                700: "#616831",
                800: "#404521",
                900: "#202310",
                950: "#101108",
            },
            accent: {
                dark: "#687e3a",
                light: "#b0c581",
                50: "#f4f7ee",
                100: "#e9efdc",
                200: "#d3dfb9",
                300: "#bdcf96",
                400: "#a7bf73",
                500: "#91af50",
                600: "#748c40",
                700: "#576930",
                800: "#3a4620",
                900: "#1d2310",
                950: "#0e1108",
            },
            error: {
                100: "#fee2e2",
                300: "#fca5a5",
                400: "#f87171",
                600: "#dc2626",
                700: "#b91c1c",
                900: "#7f1d1d",
            },
            rarity: {
                common: {
                    light: "#cccccc", // medium gray
                    default: "#b3b3b3", // darker gray
                    dark: "#666666", // even darker gray
                },
                uncommon: {
                    light: "#99ff99", // light green
                    default: "#00cc00", // darker green
                    dark: "#003300", // very dark green
                },
                rare: {
                    light: "#9999ff", // light blue
                    default: "#0000cc", // darker blue
                    dark: "#000033", // very dark blue
                },
                epic: {
                    light: "#d299d2", // light purple
                    default: "#660066", // darker purple
                    dark: "#1a001a", // very dark purple
                },
                legendary: {
                    light: "#ffcc99", // light orange
                    default: "#cc8400", // darker orange
                    dark: "#331a00", // very dark orange
                },
                ancient: {
                    light: "#ff9999", // light red
                    default: "#cc0000", // darker red
                    dark: "#330000", // very dark red
                },
            },
        },
        fontSize: {
            sm: "0.800rem",
            base: "1rem",
            xl: "1.250rem",
            "2xl": "1.563rem",
            "3xl": "1.954rem",
            "4xl": "2.442rem",
            "5xl": "3.053rem",
        },
        fontFamily: {
            heading: "Rethink Sans",
            body: "Konkhmer Sleokchher",
        },
        fontWeight: {
            normal: "400",
            bold: "700",
        },
    },
    plugins: [],
};
