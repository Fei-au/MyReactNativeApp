import { StyleSheet } from "react-native";


export const commonStyles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bigText: {
		fontSize: 24,
		fontWeight: '600',
	},
	highlight: {
		fontWeight: '700',
	},
    link: {
        color: '#0386D0',
        textDecorationLine: 'underline',
    },
});
