import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { CarouselDestinationCard, ServiceCard } from "@exploriana/components/Card";
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
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pv]}>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Body>Welcome back,</Body>
            <Heading color={theme.colors.secondary}>Adrian Sajjan</Heading>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <IconButton style={styles.notification} onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications" size={20} color={theme.colors.text} />
            </IconButton>
          </Box>
        </Box>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} marginTop={24}>
          <SearchBar editable={false} placeholder="Search for places, hotels, flights ..." />
        </Box>
        <Box flexWrap="wrap" flexDirection="row" paddingHorizontal={16} paddingTop={8}>
          <ServiceCard caption="Trains" icon={<Train height={36} />} onPress={() => navigation.navigate("Search-Trains")} />
          <ServiceCard caption="Flights" icon={<Flight height={36} />} />
          <ServiceCard caption="Hotels" icon={<Hotel height={36} />} />
          <ServiceCard caption="Tours" icon={<Tours height={36} />} />
          <ServiceCard caption="Places" icon={<Places height={36} />} onPress={() => navigation.navigate("Places")} />
          <ServiceCard caption="Weather" icon={<Weather height={36} />} />
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
        <SectionHeader button="See All" title="Ongoing Tours" marginTop={24} />
        <ScrollView horizontal overScrollMode="never" style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
          <CarouselDestinationCard />
          <CarouselDestinationCard />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
