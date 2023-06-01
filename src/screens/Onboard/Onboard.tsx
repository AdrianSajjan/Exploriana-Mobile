import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { OnboardCarousel } from "@exploriana/components/Carousel";
import { Clouds } from "@exploriana/components/Icons";
import { Body, Heading } from "@exploriana/components/Typography";
import { StatusBar } from "expo-status-bar";
import { sharedStyles } from "@exploriana/styles/shared";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardCarousel } from "@exploriana/constants";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@exploriana/interface/navigation";

type NavigationProps = NativeStackNavigationProp<AuthStackParamList, "Onboard">;

export function OnboardingScreen() {
  const navigation = useNavigation<NavigationProps>();

  function handleOnClick() {
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor="white" style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.justifyBetween, sharedStyles.pvMedium]}>
        <Box alignItems="center">
          <Clouds />
        </Box>
        <Box marginVertical={32}>
          <OnboardCarousel images={onboardCarousel} />
        </Box>
        <View style={[sharedStyles.ph]}>
          <Heading textAlign="center">Enjoy your trip</Heading>
          <Body textAlign="center" style={styles.body}>
            As one of the leading travel agencies in the world, Exploriana is here to help you plan the perfect trip. We are budget friendly and won't
            hurt your wallet.
          </Body>
          <PrimaryButton label="Get Started" fullWidth style={styles.button} onPress={handleOnClick} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 12,
  },
  button: {
    marginTop: 36,
  },
});
