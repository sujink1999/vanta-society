import {
  CheckIcon,
  InfoIcon,
  WarningIcon,
  XIcon,
} from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Notification, NotificationType } from "@/types/notification";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NOTIFICATION_COLORS = {
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const color = NOTIFICATION_COLORS[type];

  switch (type) {
    case "success":
      return <CheckIcon size={20} color={color} />;
    case "error":
      return <XIcon size={20} color={color} />;
    case "info":
      return <InfoIcon size={20} color={color} />;
    case "warning":
      return <WarningIcon size={20} color={color} />;
  }
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const slideYAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const handleDismiss = useCallback(() => {
    // Slide out to top, fade out, and scale down with bounce
    Animated.parallel([
      Animated.timing(slideYAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 400,
        easing: Easing.in(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(notification.id);
    });
  }, [slideYAnim, opacityAnim, scaleAnim, onDismiss, notification.id]);

  useEffect(() => {
    // Slide in from top, fade in, and scale up with bounce
    Animated.parallel([
      Animated.timing(slideYAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 499,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      const timeout = setTimeout(() => {
        handleDismiss();
      }, notification.duration);

      return () => clearTimeout(timeout);
    }
  }, [
    slideYAnim,
    opacityAnim,
    scaleAnim,
    notification.duration,
    handleDismiss,
  ]);

  return (
    <Animated.View
      style={[
        tw`mb-2`,
        {
          transform: [{ translateY: slideYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <BlurView
        intensity={80}
        style={tw`border border-white/10 rounded-md overflow-hidden`}
        tint="dark"
      >
        <View style={tw`flex-row items-center px-4 py-3`}>
          <View style={tw`mr-3`}>
            <NotificationIcon type={notification.type} />
          </View>
          <Text style={tw`text-white font-mont text-sm flex-1`}>
            {notification.message}
          </Text>
          <TouchableOpacity onPress={handleDismiss} style={tw`ml-2 p-1`}>
            <XIcon size={16} color="#979797" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useGlobalContext();
  const insets = useSafeAreaInsets();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View
      style={[tw`absolute left-0 right-0 px-4 z-50`, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      {[...notifications].reverse().map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
        />
      ))}
    </View>
  );
}
