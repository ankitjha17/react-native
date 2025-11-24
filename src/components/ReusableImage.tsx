import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageStyle,
  ImageResizeMode,
  StyleProp,
  Animated,
} from "react-native";

// // Analytics helper - replace with your real analytics implementation
// const trackImageError = (uri: string | null) => {
//   console.log(`[analytics] image_load_failed`, { uri });
//   // TODO: Replace with actual analytics SDK
//   // analytics.track("image_load_failed", { uri });
// };

interface ReusableImageProps {
  uri: string | null | undefined;
  fallback: any;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  showLoader?: boolean;
}

export const ReusableImage: React.FC<ReusableImageProps> = ({
  uri,
  fallback,
  style,
  resizeMode = "contain",
  showLoader = true,
}) => {
  const [didFail, setDidFail] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loggedError, setLoggedError] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleError = useCallback(() => {
    if (!loggedError && uri) {
      // trackImageError(uri);
      setLoggedError(true);
    }
    setDidFail(true);
  }, [uri, loggedError]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // If image fails or uri is null/undefined → instantly switch to local fallback
  const source =
    didFail || !uri
      ? fallback
      : { uri: uri as string, cache: "force-cache" as const };

  return (
    <View style={[styles.container, style]}>
      {showLoader && !isLoaded && (
        <View style={[StyleSheet.absoluteFillObject, styles.loader]}>
          <ActivityIndicator size="small" color="#A0A0A0" />
        </View>
      )}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: isLoaded ? fadeAnim : 0 },
        ]}
        pointerEvents="none"
      >
        <Image
          source={source}
          onError={handleError}
          onLoad={handleLoad}
          resizeMode={resizeMode}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  loader: {
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    zIndex: 1,
  },
});
