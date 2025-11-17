import { StyleSheet } from "react-native";

export const footerStyle = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 8,
        padding: 16,
        paddingBottom: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
    },
    action: {
        backgroundColor: "#2196f3",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionSecondary: {
        backgroundColor: "#ff9800",
    },
    actionReset: {
        backgroundColor: "#f44336",
    },
    actionText: { 
        color: "#fff", 
        fontWeight: "700",
        fontSize: 16,
    },
});