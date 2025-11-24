import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Screen imports
import Home from "../screens/tabs/Home";
import Profile from "../screens/tabs/profile/Profile";
import EditProfile from "../screens/tabs/profile/EditProfile";
import Support from "../screens/tabs/Support";
import Policy from "../screens/tabs/Policy";
import Claims from "../screens/tabs/Claims";
import PolicyDetails from "../screens/PolicyDetails";
import RaiseRequest from "../screens/serviceRequest/RaiseRequest";
import RaiseRequestCardDetails from "../screens/serviceRequest/RaiseRequestCardDetails";
import TravelClaimProcess from "../screens/travelClaimProcess/TravelClaimProcess";
import LifeClaimProcess from "../screens/lifeClaimProcess/lifeClaimProcessDetail";
import HealthClaimProcess from "../screens/healthClaimProcess/HealthClaimProcess";
import VehicleClaimProcess from "../screens/vehicleClaimProcess/VehicleClaimProcess";
import ApartmentClaimProcess from "../screens/apartmentClaimProcess/ApartmentClaimProcess";
import BusinessClaimProcess from "../screens/businessClaimProcess/BusinessClaimProcess";
import ClaimSuccess from "../screens/ClaimSuccess";
import FiledClaimDetail from "../screens/FiledClaimDetails";

import colors from "../constants/colors";
import fonts from "../constants/fonts";

export type AppStackParamList = {
  Tabs: undefined;
  EditProfile: undefined;
  Support: undefined;
  PolicyDetails: {
    policyId: string;
    name: string;
    policyNumber: string;
    status: string;
    startDate: string;
    validTill: string;
    premiumPerMonth: string;
    claimNumber?: string;
  };
  TravelClaimProcess: undefined;
  LifeClaimProcess: undefined;
  HealthClaimProcess: undefined;
  VehicleClaimProcess: undefined;
  ApartmentClaimProcess: undefined;
  BusinessClaimProcess: undefined;
  ClaimSuccess: { policyNumber?: string };
  FiledClaimDetail: undefined;
  RaiseRequest: undefined;
  RaiseRequestCardDetails: {
    request: {
      id: string;
      requestId: string;
      requestType: string;
      status: "Active" | "Inactive" | "Processing" | "Initiated";
      startDate: string;
      validTill: string;
      premiumPerMonth?: string;
      companyName?: string;
    };
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const Tab = createBottomTabNavigator();

const icons: Record<string, any> = {
  user: require("../assets/images/profile.png"),
  headphones: require("../assets/images/support.png"),
  folder: require("../assets/images/policy.png"),
  "edit-3": require("../assets/images/claims.png"),
  home: require("../assets/images/home.png"),
};

type TabIconProps = {
  focused: boolean;
  color: string;
  name: string;
};

const TabIcon = React.memo(function TabIcon({
  focused,
  color: _color,
  name,
}: TabIconProps) {
  return (
    <View
      style={[
        styles.iconContainer,
        focused ? styles.iconContainerActive : styles.iconContainerInactive,
      ]}
    >
      <Image
        source={icons[name]}
        style={[styles.icon, focused ? styles.tintActive : styles.tintInactive]}
        resizeMode="contain"
      />
    </View>
  );
});

export function Tabs() {
  const insets = useSafeAreaInsets();

  // 🔥 useCallback: memoizes the icon factory so it never recreates
  const makeIcon = React.useCallback((name: keyof typeof icons) => {
    const IconComponent = ({
      focused,
      color,
    }: {
      focused: boolean;
      color: string;
    }) => <TabIcon focused={focused} color={color} name={name} />;

    IconComponent.displayName = `TabIcon_${name}`;

    return IconComponent;
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.black60,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 80 + insets.bottom,
          backgroundColor: colors.white,
          borderTopColor: "rgba(0,0,0,0.06)",
          elevation: 30,
          shadowColor: "#1F000000",
          shadowOpacity: 0.18,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -4 },
          paddingTop: 12,
          paddingBottom: 10 + insets.bottom,
          paddingHorizontal: 20,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.family.regular,
          fontSize: 12,
          lineHeight: Math.round(12 * 1.2),
          marginTop: 8,
        },
        tabBarItemStyle: {
          height: 58,
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: makeIcon("user"),
        }}
      />

      <Tab.Screen
        name="Support"
        component={Support}
        options={{
          title: "Support",
          tabBarIcon: makeIcon("headphones"),
        }}
      />

      <Tab.Screen
        name="Policy"
        component={Policy}
        options={{
          title: "Policy",
          tabBarIcon: makeIcon("folder"),
        }}
      />

      <Tab.Screen
        name="Claims"
        component={Claims}
        options={{
          title: "Claims",
          tabBarIcon: makeIcon("edit-3"),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: makeIcon("home"),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{
          title: "Tabs",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PolicyDetails"
        component={PolicyDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TravelClaimProcess"
        component={TravelClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LifeClaimProcess"
        component={LifeClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HealthClaimProcess"
        component={HealthClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VehicleClaimProcess"
        component={VehicleClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApartmentClaimProcess"
        component={ApartmentClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BusinessClaimProcess"
        component={BusinessClaimProcess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ClaimSuccess"
        component={ClaimSuccess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FiledClaimDetail"
        component={FiledClaimDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RaiseRequest"
        component={RaiseRequest}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RaiseRequestCardDetails"
        component={RaiseRequestCardDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerActive: {
    backgroundColor: "#ED9923",
    borderWidth: 1.25,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  iconContainerInactive: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    opacity: 0.6,
  },
  tintActive: {
    tintColor: "#FFFFFF",
  },
  tintInactive: {
    tintColor: colors.black60,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
