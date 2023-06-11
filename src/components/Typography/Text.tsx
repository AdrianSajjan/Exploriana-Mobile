import { theme } from "@exploriana/config/theme";
import { TypographyProps } from "@exploriana/interface";
import { Text as NativeText, TextStyle } from "react-native";

type TextProps = Omit<TypographyProps, "size"> & { size?: number };

export function Text({ size, textAlign = "left", color = theme.colors.text, fontWeight = "regular", lineHeight, style, ...props }: TextProps) {
  const pStyle: TextStyle = {
    fontSize: size,
    lineHeight,
    fontFamily: theme.font[fontWeight],
    color,
    textAlign,
  };

  return <NativeText style={[pStyle, style]} {...props}></NativeText>;
}
