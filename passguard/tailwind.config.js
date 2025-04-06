/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,tsx}",
		"node_modules/flowbite-react/lib/esm/**/*.js",
	],
	theme: {
		extend: {
			fontFamily: {
				nunito: ["Nunito", "sans-serif"],
				roboto: ["Roboto", "sans-serif"],
			},
			colors: {
				yellow: {
					400: "#facc15",
				},
				blue: {
					999: "rgb(55 65 81 / 1)",
				},
				darkwhite: {
					999: "#F5F5F5",
				},
				darkbg: {
					//background color for dark mode
					999: "#010409",
				},
				darktext: {
					// main text color for dark mode
					999: "#e6edf3",
				},
				darksubtext: {
					// sub text color for dark mode
					999: "#848d97",
				},
				darkcards: {
					// card background color for dark mode
					999: "#161b22",
				},
				darkborder: {
					// border color for dark mode
					999: "#30363d",
				},
				darkinset: {
					//navbar and input fields
					999: "#0d1117",
				},
				darkbuttonblue: {
					999: "#1f6feb",
				},
			},
		},
	},
	plugins: [require("flowbite/plugin")],
};
