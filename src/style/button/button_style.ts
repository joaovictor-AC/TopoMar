import { StyleSheet } from "react-native";

export const buttonStyle = StyleSheet.create({
  ellipseButton: {
    width: 252,
    height: 114,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparent background
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 48, // Use 'gap' for spacing between flex items
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#2196f3",
    borderColor: "#2196f3",
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
