import { Body } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState } from "react";
import { Box } from "@exploriana/components/Box";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: theme.shapes.rounded.sm,
  },
  sheet: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  icon: {
    marginLeft: 8,
  },
  backdrop: {
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
});

export function SelectPicker({
  value,
  onChange,
  options,
  formatLabel,
}: {
  value?: any;
  onChange?: (value: any) => void;
  options?: Array<{ label: string | number; value: any }>;
  formatLabel?: (label: string | number) => string | number;
}) {
  const [isVisible, setVisible] = useState(false);

  const { width } = useWindowDimensions();

  const selected = options?.find((option) => option.value === value);

  function onPress(value: any) {
    return () => {
      onChange?.(value);
      setVisible(false);
    };
  }

  return (
    <Fragment>
      <TouchableOpacity activeOpacity={0.6} style={styles.container} onPress={() => setVisible(true)}>
        <Body size="md">{formatLabel && selected?.label ? formatLabel(selected.label) : selected?.label}</Body>
        <Ionicons name="chevron-down" color={theme.colors.tint} style={styles.icon} />
      </TouchableOpacity>
      <Modal visible={isVisible} onRequestClose={() => setVisible(false)} transparent statusBarTranslucent>
        <View style={styles.backdrop} />
        <View style={styles.sheet}>
          <Box backgroundColor={theme.colors.surface} borderRadius={theme.shapes.rounded.md} paddingVertical={8} overflow="hidden">
            {options?.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, { minWidth: width / 3, backgroundColor: value === option.value ? theme.colors.background : theme.colors.surface }]}
                onPress={onPress(option.value)}
              >
                <Body>{option.label}</Body>
              </TouchableOpacity>
            ))}
          </Box>
        </View>
      </Modal>
    </Fragment>
  );
}
