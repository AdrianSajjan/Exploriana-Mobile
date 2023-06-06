import { Box } from "@exploriana/components/Box";
import { IconButton, PrimaryButton } from "@exploriana/components/Button";
import { Connector, Divider } from "@exploriana/components/Divider";
import { Body, Caption, Heading, Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { Schedule } from "@exploriana/interface/core";
import { formatToIndianCurrency } from "@exploriana/lib/format";
import { sharedStyles } from "@exploriana/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Image, ImageSourcePropType, Modal, ModalProps, StyleSheet, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface BookTransportModalProps extends ModalProps {
  data?: Schedule;
  icon?: React.ReactNode;
  cover?: ImageSourcePropType;
}

const HEIGHT = 300;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    bottom: 0,
    height: HEIGHT,
    width: "100%",
    position: "absolute",
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderTopRightRadius: theme.shapes.rounded.lg,
    borderTopLeftRadius: theme.shapes.rounded.lg,
  },
  brand: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
  name: {
    marginLeft: 8,
  },
});

export function BookTransportModal({ data, icon, price, cover, visible, onRequestClose, ...props }: BookTransportModalProps) {
  const translateY = useSharedValue(HEIGHT);

  const [isOpen, setOpen] = React.useState(false);

  if (visible !== isOpen) {
    if (visible === true) {
      setOpen(true);
      translateY.value = 0;
    } else {
      translateY.value = HEIGHT;
    }
  }

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, { duration: visible ? 300 : 150 }, (finished) => {
            if (!finished || visible) return;
            runOnJS(setOpen)(false);
          }),
        },
      ],
    };
  });

  return (
    <Modal visible={isOpen} animationType="fade" transparent statusBarTranslucent onRequestClose={onRequestClose} {...props}>
      <View style={styles.backdrop} />
      <Animated.View style={[styles.sheet, rStyle]}>
        <Box alignItems="center" flexDirection="row" justifyContent="space-between">
          <Text size={18} fontWeight="bold" color={theme.colors.heading}>
            Book Tickets
          </Text>
          <IconButton onPress={onRequestClose}>
            <Ionicons name="close" size={20} />
          </IconButton>
        </Box>
        <Box marginTop={16} marginBottom={24}>
          <Divider />
        </Box>
        <Box flexDirection="row" alignItems="center">
          <Image source={cover} style={styles.brand} />
          <Body color={theme.colors.secondary} size="md" fontWeight="medium" style={styles.name}>
            Rajdhani Express
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={16}>
          <Body fontWeight="bold" color={theme.colors.secondary}>
            09:50
          </Body>
          <Connector icon={icon} />
          <Body fontWeight="bold" color={theme.colors.secondary}>
            13:40
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" marginTop={4}>
          <Caption fontWeight="medium" color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="left">
            Howrah
          </Caption>
          <Caption textAlign="center">7h 50m</Caption>
          <Caption fontWeight="medium" color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="right">
            Chennai
          </Caption>
        </Box>
        <Box marginTop={24} marginBottom={24}>
          <Divider width={1} type="dashed" />
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Caption>Trip Total</Caption>
            <Heading size="sm" color={theme.colors.secondary}>
              {formatToIndianCurrency(4500)}
            </Heading>
          </Box>
          <PrimaryButton label="Book Train" />
        </Box>
      </Animated.View>
    </Modal>
  );
}
