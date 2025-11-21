import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { Text, View } from "react-native";
import { RootStackParamList } from "./src/navigation/types";

import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const envName =
    Constants.expoConfig?.extra?.APP_ENV ||
    process.env.APP_ENV ||
    "development";

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
      <View style={{ padding: 10, backgroundColor: "#f0f0f0" }}>
        <Text>Environment: {envName}</Text>
      </View>
    </NavigationContainer>
  );
}
