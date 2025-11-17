import { StyleSheet } from "react-native";

export const textStyle = StyleSheet.create({
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
    overlayText: {
    color: 'white',
    fontSize: 16,
  },
    overlay: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    padding: 10,
  },
});
