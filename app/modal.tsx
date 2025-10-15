import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";

export default function Modal() {
  const router = useRouter();
  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <Button label="Close" onPress={() => router.back()} />
        <Button label="Close" onPress={() => router.back()} />
        <Button label="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "40%",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
});
