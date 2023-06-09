import { useFonts } from "expo-font";
import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "@exploriana/screens/Home";
import { OnboardingScreen } from "@exploriana/screens/Onboard";
import { BookTrainScreen, SearchTrainScreen, TrainCheckoutScreen } from "@exploriana/screens/Trains";
import { ForgotPasswordScreen, LoginScreen, RegisterScreen, ResetPasswordScreen } from "@exploriana/screens/Authentication";

import { createFactory } from "@exploriana/lib/core";
import { AuthStackParamList } from "@exploriana/interface/navigation";
import { sharedStyles } from "@exploriana/styles/shared";
import { StripeProvider } from "@stripe/stripe-react-native";
import { stripePublishableKey } from "@exploriana/config/stripe";
import { BoardingPassScreen } from "@exploriana/screens/Booking";

SplashScreen.preventAutoHideAsync();

const client = createFactory(QueryClient);
const Stack = createNativeStackNavigator<AuthStackParamList>();

const screenOptions: NativeStackNavigationOptions = { headerShown: false };

export default function App() {
  const [isFontsLoaded] = useFonts({
    Montserrat: require("assets/fonts/montserrat.ttf"),
    "Montserrat-Medium": require("assets/fonts/montserrat_medium.ttf"),
    "Montserrat-Bold": require("assets/fonts/montserrat_bold.ttf"),
  });

  const onInitialize = React.useCallback(() => {
    if (!isFontsLoaded) return;
    SplashScreen.hideAsync();
  }, [isFontsLoaded]);

  if (!isFontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onInitialize}>
      <StripeProvider publishableKey={stripePublishableKey}>
        <QueryClientProvider client={client}>
          <GestureHandlerRootView style={sharedStyles.fullHeight}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen name="Onboard" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Forgot-Password" component={ForgotPasswordScreen} />
                <Stack.Screen name="Reset-Password" component={ResetPasswordScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Search-Trains" component={SearchTrainScreen} />
                <Stack.Screen name="Book-Trains" component={BookTrainScreen} />
                <Stack.Screen name="Train-Checkout" component={TrainCheckoutScreen} />
                <Stack.Screen name="Boarding-Pass" component={BoardingPassScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}
