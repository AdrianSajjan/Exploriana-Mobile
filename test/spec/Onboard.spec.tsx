import { OnboardingScreen } from "@exploriana/screens/Onboard";
import { render } from "@testing-library/react-native";

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

describe("Onboarding Screen", () => {
  it("expects to be rendered", () => {
    render(<OnboardingScreen />);
  });
});
