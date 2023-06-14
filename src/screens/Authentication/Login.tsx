import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import { Ionicons, Zocial } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Box } from "@exploriana/components/Box";
import { Airplane } from "@exploriana/components/Icons";
import { Divider } from "@exploriana/components/Divider";
import { Body, Heading } from "@exploriana/components/Typography";
import { PasswordField, TextField } from "@exploriana/components/Input";
import { LinkButton, PrimaryButton, TextButton } from "@exploriana/components/Button";

import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";

import { AuthStackParamList } from "@exploriana/interface/navigation";
import { TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import { useLogin } from "@exploriana/api/auth";
import { useAuthStore } from "@exploriana/store/auth";
import { User } from "@exploriana/interface/core";

type NavigationProps = NativeStackNavigationProp<AuthStackParamList, "Login">;

const styles = StyleSheet.create({
  textField: {
    marginTop: 16,
  },
  divider: {
    marginTop: 24,
  },
  facebook: {
    flex: 1,
    marginRight: 8,
  },
  google: {
    flex: 1,
    marginLeft: 8,
  },
  login: {
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  footer: {
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerNow: {
    marginLeft: 4,
  },
});

const GoogleIconSource = { uri: "https://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png", height: 24, width: 24 };

export function LoginScreen() {
  const navigation = useNavigation<NavigationProps>();

  const login = useLogin();
  const auth = useAuthStore();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      phoneNumber: Yup.string()
        .required("Phone Nu,ber is required")
        .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, { message: "Please provide a valid phone number" }),
    }),
    onSubmit: async ({ password, phoneNumber }) => {
      try {
        const user = await login.mutateAsync({ password, phoneNumber });
        auth.update(user);
      } catch (e) {
        Alert.alert("Error", "The provided credentials are invalid");
      }
    },
  });

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.justifyBetween, sharedStyles.pv]}>
        <View style={sharedStyles.ph}>
          <Box alignItems="center">
            <Airplane height={150} width={150} />
          </Box>
          <Heading textAlign="center" color={theme.colors.secondary}>
            Welcome to Exploriana
          </Heading>
          <Body textAlign="center">Login to your account</Body>
          <Box marginTop={36}>
            <TextField
              keyboardType="number-pad"
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              placeholder="Phone Number"
              helperText="Enter your registered phone number"
              errorText="Please provide a valid phone number"
              icon={<Ionicons name="call" style={sharedStyles.inputIcon} />}
            />
            <PasswordField
              value={values.password}
              onChangeText={handleChange("password")}
              style={styles.textField}
              placeholder="Password"
              helperText="Enter your password"
              errorText="Please provide your password"
            />
            <PrimaryButton disabled={login.isLoading} style={styles.login} label="Login" onPress={() => handleSubmit()} />
          </Box>
          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("Forgot-Password")}>
            <Body size="sm" color={theme.colors.secondary}>
              Forgot Password?
            </Body>
          </TouchableOpacity>
          <Divider style={styles.divider} caption="Or Login With" />
          <Box flexDirection="row" marginTop={32}>
            <PrimaryButton label="Facebook" background="#1E63B5" style={styles.facebook} color={theme.colors.surface} icon={<Zocial name="facebook" size={20} color={theme.colors.surface} />} />
            <PrimaryButton label="Google" style={styles.google} color={theme.colors.heading} background={theme.colors.surface} icon={<Image resizeMode="contain" source={GoogleIconSource} />} />
          </Box>
        </View>
        <View style={styles.footer}>
          <Body color={theme.colors.text} textAlign="center">
            Don't have an account?
          </Body>
          <TouchableOpacity style={styles.registerNow} onPress={() => navigation.navigate("Register")}>
            <Body color={theme.colors.secondary}>Register Now</Body>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
