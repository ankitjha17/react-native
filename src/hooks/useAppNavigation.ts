import { useCallback } from "react";
import {
  useNavigation,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppStackParamList } from "../navigation/AppStack";

type TabParamList = {
  Home: undefined;
  Policy: undefined;
  Claims: undefined;
  Support: undefined;
  Profile: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  // Basic navigation methods
  const navigateToSupport = useCallback(() => {
    navigation.navigate("Support");
  }, [navigation]);

  const navigateToProfile = useCallback(() => {
    navigation.navigate("EditProfile");
  }, [navigation]);

  const navigateToTabs = useCallback(() => {
    navigation.navigate("Tabs");
  }, [navigation]);

  const navigateToRaiseRequest = useCallback(() => {
    navigation.navigate("RaiseRequest");
  }, [navigation]);

  const navigateToClaimsTab = useCallback(() => {
    (navigation as any).navigate("Tabs", { screen: "Claims" });
  }, [navigation]);

  const navigateToClaimSuccess = useCallback(
    (params?: AppStackParamList["ClaimSuccess"]) => {
      navigation.navigate("ClaimSuccess", params ?? {});
    },
    [navigation]
  );

  const navigateToFiledClaimDetail = useCallback(() => {
    navigation.navigate("FiledClaimDetail");
  }, [navigation]);

  // Parameterized navigation methods
  const navigateToPolicyDetails = useCallback(
    (params: AppStackParamList["PolicyDetails"]) => {
      navigation.navigate("PolicyDetails", params);
    },
    [navigation]
  );

  const navigateToRaiseRequestCardDetails = useCallback(
    (params: AppStackParamList["RaiseRequestCardDetails"]) => {
      navigation.navigate("RaiseRequestCardDetails", params);
    },
    [navigation]
  );

  // Claim process navigation methods
  const navigateToLifeClaimProcess = useCallback(() => {
    navigation.navigate("LifeClaimProcess");
  }, [navigation]);

  const navigateToTravelClaimProcess = useCallback(() => {
    navigation.navigate("TravelClaimProcess");
  }, [navigation]);

  const navigateToHealthClaimProcess = useCallback(() => {
    navigation.navigate("HealthClaimProcess");
  }, [navigation]);

  const navigateToVehicleClaimProcess = useCallback(() => {
    navigation.navigate("VehicleClaimProcess");
  }, [navigation]);

  const navigateToApartmentClaimProcess = useCallback(() => {
    navigation.navigate("ApartmentClaimProcess");
  }, [navigation]);

  const navigateToBusinessClaimProcess = useCallback(() => {
    navigation.navigate("BusinessClaimProcess");
  }, [navigation]);

  /**
   * Centralized logic for navigating to claim process based on policy type
   * Removes duplication across Policy.tsx and PolicyDetails.tsx
   */
  const navigateToClaimProcess = useCallback(
    (policyName: string) => {
      const nameLower = policyName.toLowerCase();
      if (nameLower.includes("health")) {
        navigation.navigate("HealthClaimProcess");
      } else if (nameLower.includes("travel")) {
        navigation.navigate("TravelClaimProcess");
      } else if (nameLower.includes("life")) {
        navigation.navigate("LifeClaimProcess");
      } else if (nameLower.includes("vehicle")) {
        navigation.navigate("VehicleClaimProcess");
      } else if (nameLower.includes("apartment")) {
        navigation.navigate("ApartmentClaimProcess");
      } else if (nameLower.includes("business")) {
        navigation.navigate("BusinessClaimProcess");
      } else {
        // Default to TravelClaimProcess for unknown policy types
        navigation.navigate("TravelClaimProcess");
      }
    },
    [navigation]
  );

  // Navigation control methods
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    // Basic navigations
    navigateToSupport,
    navigateToProfile,
    navigateToTabs,
    navigateToRaiseRequest,
    navigateToClaimsTab,
    navigateToClaimSuccess,
    navigateToFiledClaimDetail,

    // Parameterized navigations
    navigateToPolicyDetails,
    navigateToRaiseRequestCardDetails,

    // Claim process navigations
    navigateToLifeClaimProcess,
    navigateToTravelClaimProcess,
    navigateToHealthClaimProcess,
    navigateToVehicleClaimProcess,
    navigateToApartmentClaimProcess,
    navigateToBusinessClaimProcess,
    navigateToClaimProcess,

    // Navigation control
    goBack,

    // Expose raw navigation object for edge cases
    navigation,
  };
};
