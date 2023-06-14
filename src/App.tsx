import "react-native-get-random-values";
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
import { AppStackParamList, AuthStackParamList } from "@exploriana/interface/navigation";
import { sharedStyles } from "@exploriana/styles/shared";
import { StripeProvider } from "@stripe/stripe-react-native";
import { stripePublishableKey } from "@exploriana/config/stripe";
import { BoardingPassScreen } from "@exploriana/screens/Booking";
import { PlacesScreen } from "@exploriana/screens/Places";
import { NotificationScreen } from "@exploriana/screens/Notifications";
import { BookFlightScreen, FlightCheckoutScreen, SearchFlightScreen } from "@exploriana/screens/Flights";

SplashScreen.preventAutoHideAsync();

const client = createFactory(QueryClient);
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

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
              <AuthStack.Navigator screenOptions={screenOptions}>
                <AuthStack.Screen name="Onboard" component={OnboardingScreen} />
                <AuthStack.Screen name="Login" component={LoginScreen} />
                <AuthStack.Screen name="Register" component={RegisterScreen} />
                <AuthStack.Screen name="Forgot-Password" component={ForgotPasswordScreen} />
                <AuthStack.Screen name="Reset-Password" component={ResetPasswordScreen} />
              </AuthStack.Navigator>
              <AppStack.Navigator>
                <AppStack.Screen name="Home" component={HomeScreen} />
                <AppStack.Screen name="Search-Trains" component={SearchTrainScreen} />
                <AppStack.Screen name="Book-Trains" component={BookTrainScreen} />
                <AppStack.Screen name="Train-Checkout" component={TrainCheckoutScreen} />
                <AppStack.Screen name="Search-Flights" component={SearchFlightScreen} />
                <AppStack.Screen name="Book-Flights" component={BookFlightScreen} />
                <AppStack.Screen name="Flight-Checkout" component={FlightCheckoutScreen} />
                <AppStack.Screen name="Boarding-Pass" component={BoardingPassScreen} />
                <AppStack.Screen name="Places" component={PlacesScreen} />
                <AppStack.Screen name="Notifications" component={NotificationScreen} />
              </AppStack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}
