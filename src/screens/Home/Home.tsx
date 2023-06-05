import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { SearchBar } from "@exploriana/components/Input";
import { Heading, Body } from "@exploriana/components/Typography";
import { SectionHeader } from "@exploriana/components/Layout";
import { Bus, Flight, Hotel, Restro, Tours, Train } from "@exploriana/components/Icons";
import { CarouselDestinationCard, CarouselOfferCard, ServiceCard } from "@exploriana/components/Card";

import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { IconButton } from "@exploriana/components/Button";
import { Avatar } from "@exploriana/components/Avatar/Avatar";
import { AppStackParamList } from "@exploriana/interface/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Search-Trains">;

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
});

export function HomeScreen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall]}>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Body>Welcome back,</Body>
            <Heading>Adrian Sajjan</Heading>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <IconButton>
              <Avatar size={32} source="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzDIdIEoKmi101JPpAOEpsDz65yTL315CgWly8LwDI&s" />
            </IconButton>
            <IconButton style={styles.notification}>
              <Ionicons name="notifications" size={20} color={theme.colors.text} />
            </IconButton>
          </Box>
        </Box>
        <Box paddingHorizontal={sharedStyles.ph.paddingHorizontal} marginTop={24}>
          <SearchBar placeholder="Search for places, hotels, flights ..." />
        </Box>
        <Box flexWrap="wrap" flexDirection="row" paddingHorizontal={16} paddingTop={8}>
          <ServiceCard caption="Flights" icon={<Flight height={36} />} />
          <ServiceCard caption="Hotels" icon={<Hotel height={36} />} />
          <ServiceCard caption="Restro" icon={<Restro height={36} />} />
          <ServiceCard caption="Tours" icon={<Tours height={36} />} />
          <ServiceCard caption="Bus" icon={<Bus height={36} />} />
          <ServiceCard caption="Trains" icon={<Train height={36} />} onPress={() => navigation.navigate("Search-Trains")} />
        </Box>
        <SectionHeader button="See All" title="Offers" marginTop={28} />
        <ScrollView horizontal overScrollMode="never" style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
          <CarouselOfferCard />
          <CarouselOfferCard />
        </ScrollView>
        <SectionHeader button="See All" title="Popular Destinations" marginTop={24} />
        <ScrollView horizontal overScrollMode="never" style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
          <CarouselDestinationCard />
          <CarouselDestinationCard />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
