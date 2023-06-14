import { useRegister } from "@exploriana/api/auth";
import * as Yup from "yup";
import { Box } from "@exploriana/components/Box";
import { LinkButton, PrimaryButton } from "@exploriana/components/Button";
import { Divider } from "@exploriana/components/Divider";
import { Airplane } from "@exploriana/components/Icons";
import { PasswordField, TextField } from "@exploriana/components/Input";
import { Body, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import { AuthStackParamList } from "@exploriana/interface/navigation";
import { useAuthStore } from "@exploriana/store/auth";
import { sharedStyles } from "@exploriana/styles/shared";
import { Ionicons, Zocial } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useFormik } from "formik";
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProps = NativeStackNavigationProp<AuthStackParamList, "Register">;

const styles = StyleSheet.create({
  textField: {
    marginTop: 16,
  },
  facebook: {
    flex: 1,
    marginRight: 8,
  },
  google: {
    flex: 1,
    marginLeft: 8,
  },
  register: {
    marginTop: 20,
  },
  footer: {
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  login: {
    marginLeft: 4,
  },
});

const GoogleIconSource = { uri: "https://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png", height: 24, width: 24 };

export function RegisterScreen() {
  const navigation = useNavigation<NavigationProps>();

  const auth = useAuthStore();
  const register = useRegister();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      password: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object().shape({
      phoneNumber: Yup.string()
        .required("Phone Nu,ber is required")
        .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, { message: "Please provide a valid phone number" }),
    }),
    onSubmit: async ({ password, phoneNumber, fullName }) => {
      try {
        const user = await register.mutateAsync({ password, phoneNumber, fullName });
        auth.update(user);
      } catch (e) {
        Alert.alert("Error", "Something went wrong please try again.");
      }
    },
  });

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.justifyBetween, sharedStyles.pv]}>
        <View style={[sharedStyles.ph]}>
          <Box alignItems="center">
            <Airplane height={80} width={80} />
          </Box>
          <Heading textAlign="center" color={theme.colors.secondary}>
            Welcome to Exploriana
          </Heading>
          <Body textAlign="center">Create your account to continue</Body>
          <Box marginTop={36}>
            <TextField
              value={values.fullName}
              onChangeText={handleChange("fullName")}
              placeholder="Full Name"
              helperText="Enter your full name"
              errorText="Please provide a your full name"
              icon={<Ionicons name="call" style={sharedStyles.inputIcon} />}
            />
            <TextField
              keyboardType="number-pad"
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              style={styles.textField}
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
            <PasswordField style={styles.textField} placeholder="Confirm Password" helperText="Re-enter your password" errorText="Passwords doesn't match" />
            <PrimaryButton style={styles.register} label="Register" onPress={() => handleSubmit()} />
          </Box>
          <Divider style={{ marginTop: 24 }} caption="Or Register With" />
          <Box flexDirection="row" marginTop={24}>
            <PrimaryButton label="Facebook" style={styles.facebook} background="#1E63B5" color={theme.colors.surface} icon={<Zocial name="facebook" size={20} color={theme.colors.surface} />} />
            <PrimaryButton icon={<Image resizeMode="contain" source={GoogleIconSource} />} style={styles.google} label="Google" color={theme.colors.heading} background={theme.colors.surface} />
          </Box>
        </View>
        <View style={styles.footer}>
          <Body color={theme.colors.text} textAlign="center">
            Already have an account?
          </Body>
          <TouchableOpacity style={styles.login} onPress={() => navigation.navigate("Login")}>
            <Body color={theme.colors.secondary}>Login</Body>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
