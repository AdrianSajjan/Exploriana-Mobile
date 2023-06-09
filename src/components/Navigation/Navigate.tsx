import { AppStackParamList } from "@exploriana/interface/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as React from "react";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Search-Trains">;
type Key = keyof AppStackParamList;

export function Navigate({ to }: { to: Key }) {
  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    navigation.navigate(to);
  }, []);

  return null;
}
