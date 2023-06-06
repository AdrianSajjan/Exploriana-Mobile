import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Box } from "@exploriana/components/Box";
import { Clouds } from "@exploriana/components/Icons";
import { PrimaryButton } from "@exploriana/components/Button";
import { Body, Heading } from "@exploriana/components/Typography";
import { OnboardCarousel } from "@exploriana/components/Carousel";

import { theme } from "@exploriana/config";
import { onboardCarousel } from "@exploriana/constants";
import { sharedStyles } from "@exploriana/styles/shared";

import { AuthStackParamList } from "@exploriana/interface/navigation";

type NavigationProps = NativeStackNavigationProp<AuthStackParamList, "Onboard">;

export function OnboardingScreen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.justifyBetween, sharedStyles.pvMedium]}>
        <Box alignItems="center">
          <Clouds />
        </Box>
        <Box marginVertical={32}>
          <OnboardCarousel images={onboardCarousel} />
        </Box>
        <View style={[sharedStyles.ph]}>
          <Heading textAlign="center">Enjoy your trip</Heading>
          <Body textAlign="center" lineHeight={26} style={styles.body}>
            As one of the leading travel agencies in the world, Exploriana is here to help you plan the perfect trip. We are budget friendly and won't hurt your wallet.
          </Body>
          <PrimaryButton label="Get Started" fullWidth style={styles.button} onPress={() => navigation.navigate("Login")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 8,
  },
  button: {
    marginTop: 24,
  },
});
