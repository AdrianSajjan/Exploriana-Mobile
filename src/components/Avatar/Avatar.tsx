import { Image, StyleSheet } from "react-native";

interface AvatarProps {
  name?: string;
  size?: number;
  source?: string;
}

export function Avatar({ size = 24, source }: AvatarProps) {
  return <Image source={{ uri: source, height: size, width: size }} resizeMode="cover" borderRadius={size} />;
}
