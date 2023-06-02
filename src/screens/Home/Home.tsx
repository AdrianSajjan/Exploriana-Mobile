import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { SearchBar } from "@exploriana/components/Input";
import { SectionHeader } from "@exploriana/components/Layout";
import { Bus, Flight, Hotel, Restro, Tours, Train } from "@exploriana/components/Icons";
import { CarouselDestinationCard, CarouselOfferCard, ServiceCard } from "@exploriana/components/Card";

import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";

const styles = StyleSheet.create({
  brand: {
    width: 70,
    height: 40,
  },
  content: {
    flexGrow: 1,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 12,
  },
  container: {
    flexGrow: 0,
  },
});

export function HomeScreen() {
  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall]}>
        <Box paddingHorizontal={24}>
          <SearchBar placeholder="Search for places, hotels, flights ..." />
        </Box>
        <Box flexWrap="wrap" flexDirection="row" paddingHorizontal={16} paddingTop={8}>
          <ServiceCard caption="Flights" icon={<Flight height={36} />} />
          <ServiceCard caption="Hotels" icon={<Hotel height={36} />} />
          <ServiceCard caption="Restro" icon={<Restro height={36} />} />
          <ServiceCard caption="Tours" icon={<Tours height={36} />} />
          <ServiceCard caption="Bus" icon={<Bus height={36} />} />
          <ServiceCard caption="Trains" icon={<Train height={36} />} />
        </Box>
        <SectionHeader button="See All" title="Offers" />
        <ScrollView horizontal overScrollMode="never" style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
          <CarouselOfferCard />
          <CarouselOfferCard />
        </ScrollView>
        <SectionHeader button="See All" title="Popular Destinations" marginTop={16} />
        <ScrollView horizontal overScrollMode="never" style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
          <CarouselDestinationCard />
          <CarouselDestinationCard />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
