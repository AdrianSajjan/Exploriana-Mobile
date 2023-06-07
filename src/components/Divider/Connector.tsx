import { Box } from "@exploriana/components/Box";
import { Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { useWindowDimensions } from "react-native";

export function Connector({ icon, label }: { icon: React.ReactNode; label?: string }) {
  const { width } = useWindowDimensions();

  return (
    <Box flex={1} flexDirection="row" alignItems="center" paddingHorizontal={16}>
      <Box height={8} width={8} borderRadius={8} borderWidth={1} borderColor={theme.colors.text} />
      <Box borderTopWidth={1} borderTopColor={theme.colors.text} borderStyle="dashed" flex={1} />
      <Box paddingHorizontal={4} position="relative">
        {icon}
        {Boolean(label) && (
          <Box position="absolute" width={width} left={-width / 2 + 15} top={24}>
            <Text size={13} textAlign="center" color={theme.colors.tint}>
              {label}
            </Text>
          </Box>
        )}
      </Box>
      <Box borderTopWidth={1} borderTopColor={theme.colors.text} borderStyle="dashed" flex={1} />
      <Box height={8} width={8} borderRadius={8} borderWidth={1} borderColor={theme.colors.text} />
    </Box>
  );
}
