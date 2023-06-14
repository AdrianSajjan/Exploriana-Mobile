import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { CarouselDestinationCard, ServiceCard, ServiceCardLarge } from "@exploriana/components/Card";
import { Flight, Hotel, Places, Tours, Train } from "@exploriana/components/Icons";
import { SearchBar } from "@exploriana/components/Input";
import { SectionHeader } from "@exploriana/components/Layout";
import { Body, Heading, Text } from "@exploriana/components/Typography";

import { IconButton } from "@exploriana/components/Button";
import { theme } from "@exploriana/config/theme";
import { AppStackParamList } from "@exploriana/interface/navigation";
import { sharedStyles } from "@exploriana/styles/shared";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Weather } from "@exploriana/components/Icons/Weather";
import { useAuthStore } from "@exploriana/store/auth";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Home">;

const styles = StyleSheet.create({
  brand: {
    width: 70,
    height: 40,
  },
  content: {
    flexGrow: 1,
    paddingRight: 24,
    paddingTop: 10,
  },
  container: {
    flexGrow: 0,
  },
  notification: {
    marginLeft: 12,
  },
  banner: {
    position: "relative",
    height: 180,
  },
  card: {
    minWidth: 120,
  },
  overlay: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.shapes.rounded.lg,
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
});

export function HomeScreen() {
  const auth = useAuthStore();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pv]}>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Body>Welcome back,</Body>
            <Heading color={theme.colors.secondary}>{auth.user?.fullName}</Heading>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <IconButton style={styles.notification} onPress={auth.logout}>
              <Ionicons name="log-out" size={22} color={theme.colors.text} />
            </IconButton>
            <IconButton style={styles.notification} onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications" size={20} color={theme.colors.text} />
            </IconButton>
          </Box>
        </Box>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} marginTop={24}>
          <Pressable onPress={() => navigation.navigate("Places")}>
            <SearchBar editable={false} placeholder="Search for places, hotels, restaurants..." />
          </Pressable>
        </Box>
        <Box paddingHorizontal={16} paddingTop={8}>
          <ServiceCardLarge title="Book Trains" caption="Book trains at competitive prices" icon={<Train height={42} />} onPress={() => navigation.navigate("Search-Trains")} />
          <ServiceCardLarge title="Book Flights" caption="Book flights at competitive prices" icon={<Flight height={42} />} onPress={() => navigation.navigate("Search-Flights")} />
          <ServiceCardLarge title="Search Places" caption="Search places at ease" icon={<Places height={42} />} onPress={() => navigation.navigate("Places")} />
        </Box>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} marginTop={24}>
          <ImageBackground source={require("assets/images/banner.jpeg")} style={styles.banner} borderRadius={theme.shapes.rounded.lg}>
            <View style={styles.overlay}>
              <Text color={theme.colors.surface} size={18} fontWeight="medium">
                Indigo Airlines offering upto 50% off
              </Text>
              <Body size="sm" color={theme.colors.divider}>
                Travel to your favourite places for cheap. T&C apply.
              </Body>
            </View>
          </ImageBackground>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
