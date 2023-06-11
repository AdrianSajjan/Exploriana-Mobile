import { useCreatePaymentIntent } from "@exploriana/api/payments";
import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { TransportCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { Navigate } from "@exploriana/components/Navigation";
import { Body, Caption, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import { formatToIndianLocale } from "@exploriana/lib/format";
import { useTransportStore } from "@exploriana/store/transport";
import { sharedStyles } from "@exploriana/styles/shared";
import { useStripe } from "@stripe/stripe-react-native";
import { isAxiosError } from "axios";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, FlatList, ListRenderItem, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TravelClass, travelClassCards } from "@exploriana/constants/transport";
import { calculateTotalAmount } from "@exploriana/lib/payment";
import { SelectPicker } from "@exploriana/components/Picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@exploriana/interface/navigation";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Train-Checkout">;

const styles = StyleSheet.create({
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
  label: {
    marginLeft: 4,
  },
  classCardCarousel: {
    marginTop: 10,
    marginHorizontal: -sharedStyles.ph.paddingHorizontal,
  },
  classCardContainer: {
    paddingHorizontal: sharedStyles.ph.paddingHorizontal,
  },
  classCard: {
    width: 250,
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
  checkout: {
    width: 160,
  },
});

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

const seatOptions = [
  { label: "1 seat", value: 1 },
  { label: "2 seats", value: 2 },
  { label: "3 seats", value: 3 },
  { label: "4 seats", value: 4 },
  { label: "5 seats", value: 5 },
  { label: "6 seats", value: 6 },
];

export function TrainCheckoutScreen() {
  const [seats, setSeats] = React.useState(1);
  const [travelClass, setTravelClass] = React.useState("standard");
  const [isProcessingPayment, setProcessingPaymentStatus] = React.useState(false);

  const stripe = useStripe();
  const transport = useTransportStore();
  const navigation = useNavigation<NavigationProps>();
  const createPaymentIntent = useCreatePaymentIntent();

  const totalAmount = React.useMemo(() => {
    if (!transport.selected) return 0;
    const index = travelClassCards.findIndex((card) => card.type === travelClass);
    const extra = travelClassCards[index].price[transport.selected.type];
    return calculateTotalAmount({ base: transport.selected.price, multiplier: seats, extra });
  }, [transport.selected, travelClassCards, travelClass, seats]);

  async function handleCheckout() {
    if (!transport.selected) return;
    try {
      setProcessingPaymentStatus(true);
      const intent = await createPaymentIntent.mutateAsync({ amount: totalAmount });
      const init = await stripe.initPaymentSheet({ merchantDisplayName: "Exploriana Inc.", paymentIntentClientSecret: intent.client_secret, style: "alwaysLight" });
      if (init.error) throw init.error;
      const present = await stripe.presentPaymentSheet();
      if (present.error) throw present.error;
      ToastAndroid.show(`Your booking for train number ${transport.selected.id} is created.`, ToastAndroid.LONG);
      setProcessingPaymentStatus(false);
      navigation.navigate("Boarding-Pass");
    } catch (error) {
      setProcessingPaymentStatus(false);
      const message = isAxiosError(error) ? error.response?.data?.message ?? error.message : error?.message ?? "Unable to complete this payment";
      Alert.alert("Payment Failed", message);
    }
  }

  function keyExtractor(item: TravelClass) {
    return item.type;
  }

  const renderItemSeparator = React.useCallback(() => {
    return <Box width={20} />;
  }, []);

  const renderItem: ListRenderItem<TravelClass> = React.useCallback(
    ({ item }) => {
      return (
        <Pressable onPress={() => setTravelClass(item.type)}>
          <View style={[styles.classCard, { borderColor: item.type === travelClass ? theme.colors.primary : theme.colors.surface }]}>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={8}>
              <Body fontWeight="bold" color={theme.colors.secondary}>
                {item.name}
              </Body>
              <Body size="lg" color={theme.colors.primary} fontWeight="bold">
                <Body color={theme.colors.primary} size="sm">
                  ₹&nbsp;
                </Body>
                {formatToIndianLocale(item.price[transport.selected!.type])}
              </Body>
            </Box>
            <Divider />
            <Box marginTop={4} marginBottom={2}>
              {item.facilities.map((facility) => (
                <Box flexDirection="row" alignItems="center" key={facility.name} marginTop={8}>
                  <Ionicons name={facility.status ? "checkmark-sharp" : "close-sharp"} color={facility.status ? theme.colors.success : theme.colors.error} size={15} />
                  <Body size="sm" style={styles.label}>
                    {facility.name}
                  </Body>
                </Box>
              ))}
            </Box>
          </View>
        </Pressable>
      );
    },
    [travelClass]
  );

  if (!transport.selected) return <Navigate to="Search-Trains" />;

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall, sharedStyles.ph]}>
        <PageHeader title="Checkout" />
        <Box marginTop={36}>
          <TransportCard cover={require("assets/images/IRCTC.png")} icon={TrainIcon} data={transport.selected} />
        </Box>
        <Box marginTop={32}>
          <Body fontWeight="medium" color={theme.colors.heading}>
            Select Class
          </Body>
          <FlatList
            horizontal
            data={travelClassCards}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={renderItemSeparator}
            showsHorizontalScrollIndicator={false}
            style={styles.classCardCarousel}
            contentContainerStyle={styles.classCardContainer}
          />
        </Box>
        <Box marginTop={28}>
          <Body fontWeight="medium" color={theme.colors.heading}>
            Seating
          </Body>
          <Box marginTop={10} backgroundColor={theme.colors.surface} borderRadius={theme.shapes.rounded.lg} padding={12} flexDirection="row" alignContent="center">
            <Box backgroundColor={theme.colors.background} alignSelf="flex-start" padding={8} borderRadius={theme.shapes.rounded.sm}>
              <MaterialCommunityIcons name="seat-passenger" color={theme.colors.secondary} size={24} />
            </Box>
            <Box justifyContent="center" marginLeft={10} flex={1}>
              <Body fontWeight="medium" lineHeight={16} size="sm">
                Total Seats
              </Body>
              <Caption>Seating will be auto assigned</Caption>
            </Box>
            <Box>
              <SelectPicker value={seats} formatLabel={(label) => String(label).split(" ")[0]} onChange={(value) => setSeats(value)} options={seatOptions} />
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor={theme.colors.surface} padding={20}>
        <Box>
          <Caption>Trip Total</Caption>
          <Heading size="sm" style={styles.price}>
            <Body color={theme.colors.heading} size="md">
              ₹&nbsp;
            </Body>
            {formatToIndianLocale(totalAmount / 100)}
          </Heading>
        </Box>
        <PrimaryButton disabled={isProcessingPayment} onPress={handleCheckout} label="Book Now" style={styles.checkout} />
      </Box>
    </SafeAreaView>
  );
}
