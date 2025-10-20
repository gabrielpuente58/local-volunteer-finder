import React from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  style?:
    | StyleProp<ViewStyle>
    | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  textStyle?: StyleProp<TextStyle>;
};

export default function CustomButton({
  label,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
