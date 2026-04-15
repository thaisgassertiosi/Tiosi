import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddBowlScreen } from "../screens/AddBowlScreen";
import { BowlDetailScreen } from "../screens/BowlDetailScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import { theme } from "../theme";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: theme.textDeep,
        headerStyle: { backgroundColor: theme.surfaceSoft },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
          color: theme.textDeep,
          letterSpacing: 0.2,
        },
        contentStyle: { backgroundColor: theme.bg },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddBowl"
        component={AddBowlScreen}
        options={{ title: "Add Bowl" }}
      />
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: "My Library" }}
      />
      <Stack.Screen
        name="BowlDetail"
        component={BowlDetailScreen}
        options={{ title: "Bowl" }}
      />
    </Stack.Navigator>
  );
}
