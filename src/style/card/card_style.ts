import { StyleSheet } from "react-native";

export const cardStyle = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardSubmerged: {
    backgroundColor: "#ffebee",
    borderColor: "#ef5350",
    borderWidth: 2,
  },
  cardMarginBottom: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    color: "#1a1a1a",
  },
  visibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  labelBold: {
    fontWeight: "700",
    color: "#1a1a1a",
    fontSize: 15,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  valueBold: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  seaLevelCard: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#2196f3",
  },
  seaLevelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565c0",
    marginBottom: 8,
  },
  seaLevelInput: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2196f3",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#1565c0",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for footer buttons
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
});
