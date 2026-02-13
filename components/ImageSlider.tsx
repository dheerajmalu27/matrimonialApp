import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

const { width } = Dimensions.get("window");

interface ImageSliderProps {
  images: string[];
  height?: number;
  showIndicators?: boolean;
}

export function ImageSlider({
  images,
  height = 300,
  showIndicators = true,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        const threshold = 50; // Minimum swipe distance

        if (dx > threshold) {
          // Swipe right - previous image
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        } else if (dx < -threshold) {
          // Swipe left - next image
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
      },
    }),
  ).current;

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <ThemedText style={styles.placeholderText}>
            No images available
          </ThemedText>
        </View>
      </View>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <View style={[styles.container, { height }]} {...panResponder.panHandlers}>
      <Image
        source={{ uri: images[currentIndex] }}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />

      {images.length > 1 && (
        <>
          {/* Navigation buttons */}
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.rightButton]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>

          {/* Indicators */}
          {showIndicators && (
            <View style={styles.indicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: width,
  },
  image: {
    width: width,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -20 }],
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  indicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  counter: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  counterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
