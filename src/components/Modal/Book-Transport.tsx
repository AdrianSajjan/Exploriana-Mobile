import { useConfig } from "@exploriana/api/config";
import { useCreatePaymentIntent } from "@exploriana/api/payments";
import { Box } from "@exploriana/components/Box";
import { IconButton, PrimaryButton } from "@exploriana/components/Button";
import { Connector, Divider } from "@exploriana/components/Divider";
import { Body, Caption, Heading, Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { stripeSecretKey } from "@exploriana/config/app";
import { Transport } from "@exploriana/interface/core";
import { initializeDate } from "@exploriana/lib/core";
import { formatTimeInterval, formatToIndianLocale } from "@exploriana/lib/format";
import { sharedStyles } from "@exploriana/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { format, intervalToDuration } from "date-fns";
import * as React from "react";
import { isAxiosError } from "axios";
import { Alert } from "react-native";
import { Image, ImageSourcePropType, Modal, ModalProps, StyleSheet, View, KeyboardAvoidingView, ToastAndroid } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

interface BookTransportModalProps extends ModalProps {
  data?: Transport;
  icon?: React.ReactNode;
  cover?: ImageSourcePropType;
  onSuccess?: () => void;
}

const HEIGHT = 400;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 20,
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
  price: {
    marginTop: 2,
  },
});

export function BookTransportModal({ data, icon, cover, visible, onRequestClose, onSuccess, ...props }: BookTransportModalProps) {
  const translateY = useSharedValue(HEIGHT);

  const stripe = useStripe();
  const createPaymentIntent = useCreatePaymentIntent();

  const [isProcessingPayment, setProcessingPaymentStatus] = React.useState(false);

  React.useEffect(() => {
    if (visible) translateY.value = withDelay(150, withTiming(0, { duration: 250 }));
    else translateY.value = withDelay(150, withTiming(HEIGHT, { duration: 0 }));
  }, [visible]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  async function handleBookNow(event) {
    if (!data) return;
    try {
      const intent = await createPaymentIntent.mutateAsync({ amount: data.price * 100 });
      const init = await stripe.initPaymentSheet({ merchantDisplayName: "Exploriana Inc.", paymentIntentClientSecret: intent.client_secret, style: "alwaysLight" });
      if (init.error) return Alert.alert("Payment Failed", init.error.message);
      setProcessingPaymentStatus(true);
      const present = await stripe.presentPaymentSheet();
      if (present.error) return Alert.alert("Payment Failed", present.error.message);
      ToastAndroid.showWithGravity(`Your booking for train number ${data.id} is created.`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      setProcessingPaymentStatus(false);
      onRequestClose?.(event);
      onSuccess?.();
    } catch (error) {
      setProcessingPaymentStatus(false);
      const message = isAxiosError(error) ? error.response?.data?.message ?? error.message : "Unable to complete this payment";
      Alert.alert("Payment Failed", message);
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onRequestClose} {...props}>
      <View style={styles.backdrop} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Animated.View style={[styles.sheet, rStyle]}>
          <Box alignItems="center" flexDirection="row" justifyContent="space-between">
            <Text size={18} fontWeight="bold" color={theme.colors.heading}>
              Book Tickets
            </Text>
            <IconButton onPress={onRequestClose}>
              <Ionicons name="close" size={20} />
            </IconButton>
          </Box>
          <Box marginTop={16} marginBottom={24} marginHorizontal={-20}>
            <Divider />
          </Box>
          <Box flexDirection="row" alignItems="center">
            <Image source={cover} style={styles.brand} />
            <Body color={theme.colors.secondary} size="md" fontWeight="medium" style={styles.name}>
              {data?.name}
            </Body>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={16}>
            <Body fontWeight="bold" color={theme.colors.secondary}>
              {format(initializeDate(data?.timeOfDeparture), "HH:mm")}
            </Body>
            <Connector icon={icon} />
            <Body fontWeight="bold" color={theme.colors.secondary}>
              {format(initializeDate(data?.timeOfArrival), "HH:mm")}
            </Body>
          </Box>
          <Box flexDirection="row" alignItems="center" marginTop={4}>
            <Caption color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="left">
              {data?.placeOfDeparture}
            </Caption>
            <Caption textAlign="center">{formatTimeInterval(intervalToDuration({ start: initializeDate(data?.timeOfDeparture), end: initializeDate(data?.timeOfArrival) }))}</Caption>
            <Caption color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="right">
              {data?.placeOfArrival}
            </Caption>
          </Box>
          <Box marginVertical={24}>
            <Divider width={1} type="dashed" />
          </Box>
          <Box></Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Caption>Trip Total</Caption>
              <Heading size="sm" style={styles.price}>
                <Body color={theme.colors.heading} size="md">
                  ₹&nbsp;
                </Body>
                {formatToIndianLocale(data?.price ?? 0)}
              </Heading>
            </Box>
            <PrimaryButton disabled={isProcessingPayment} onPress={handleBookNow} label="Book Now" />
          </Box>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
