import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "@exploriana/screens/Home";
import { OnboardingScreen } from "@exploriana/screens/Onboard";
import { ForgotPasswordScreen, LoginScreen, RegisterScreen, ResetPasswordScreen } from "@exploriana/screens/Authentication";

import { AuthStackParamList } from "@exploriana/interface/navigation";
import { TrainSearchScreen } from "@exploriana/screens/Trains";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator</*AuthStackParamList*/ any>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/montserrat.ttf"),
    "Montserrat-Medium": require("../assets/fonts/montserrat_medium.ttf"),
    "Montserrat-Bold": require("../assets/fonts/montserrat_bold.ttf"),
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Train-Search" component={TrainSearchScreen} />
          {/* <Stack.Screen name="Onboard" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Forgot-Password" component={ForgotPasswordScreen} />
          <Stack.Screen name="Reset-Password" component={ResetPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
