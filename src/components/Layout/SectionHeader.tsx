import { theme } from "@exploriana/config/theme";
import { TouchableOpacity } from "react-native";
import { Box } from "@exploriana/components/Box";
import { Body, Caption } from "@exploriana/components/Typography";

interface SectionHeaderProps {
  title: string;
  button?: string;
  marginTop?: number;
  onPress?: () => void;
}

export function SectionHeader({ button, title, marginTop = 24 }: SectionHeaderProps) {
  return (
    <Box paddingHorizontal={24} marginTop={marginTop} justifyContent="space-between" alignItems="center" flexDirection="row">
      <Body size="lg" fontWeight="bold" color={theme.colors.heading}>
        {title}
      </Body>
      {Boolean(button) && (
        <TouchableOpacity>
          <Caption>{button}</Caption>
        </TouchableOpacity>
      )}
    </Box>
  );
}
