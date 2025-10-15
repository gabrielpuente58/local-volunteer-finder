import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import { useProfileImage } from "../../store/profileImageStore";

const AVATAR_SIZE = 200;

export default function Profile() {
  const router = useRouter();
  const { uri, loading } = useProfileImage();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // ----------------------------------------------------------------
  // UNUSED BUT MAYBE USEFUL LATER:
  // const [imageUri, setImageUri] = useState<string | null>(null);

  // const pickFromGallery = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });
  //   if (!result.canceled) setImageUri(result.assets[0].uri);
  // };

  // const takePhoto = async () => {
  //   const result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });
  //   if (!result.canceled) setImageUri(result.assets[0].uri);
  // };
  // ----------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture</Text>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <FontAwesome name="user" size={90} color="#ccc" />
        </View>
      )}
      <Button
        label="Edit Picture"
        onPress={() => router.push("../modal")}
        style={({ pressed }) => [
          {
            marginTop: 30,
            marginBottom: 10,
            backgroundColor: pressed ? "#005BBB" : "#007AFF",
            padding: 10,
            borderRadius: 5,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        textStyle={{ color: "white", fontWeight: "600", textAlign: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 16,
  },
  image: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginTop: 12,
  },
  placeholder: {
    backgroundColor: "#f2f2f2", // light gray like iOS default
    alignItems: "center",
    justifyContent: "center",
  },
});
