import { TEXT_COLOR } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const modalStyle = StyleSheet.create({
  calloutTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 3,
  },
  calloutOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calloutContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    elevation: 6,
  },
  visibilityContent: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
    borderRadius: 10,
    textAlign: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
    mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR,
    marginBottom: 4,
  },
  label: {
    fontWeight: '700',
    color: TEXT_COLOR,
  },
  value: {
    fontWeight: '400',
    color: '#222',
  }
});
