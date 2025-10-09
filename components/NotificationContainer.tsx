import {
  CheckIcon,
  ConfidenceIcon,
  DisciplineIcon,
  InfoIcon,
  MindsetIcon,
  MomentumIcon,
  StrengthIcon,
  VitalIcon,
  WarningIcon,
  XIcon,
} from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  Notification,
  NotificationType,
  VitalNotification,
  VitalType,
} from "@/types/notification";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

interface VitalNotificationItemProps {
  notification: VitalNotification;
  onDismiss: (id: string) => void;
}

const NOTIFICATION_COLORS = {
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
  vital: "#FF5C2A",
};

const VITAL_NAMES: Record<VitalType, string> = {
  discipline: "Discipline",
  mindset: "Mindset",
  strength: "Strength",
  momentum: "Momentum",
  confidence: "Confidence",
  society: "Society",
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const color = NOTIFICATION_COLORS[type];

  switch (type) {
    case "success":
      return <CheckIcon size={24} color={color} />;
    case "error":
      return <XIcon size={24} color={color} />;
    case "info":
      return <InfoIcon size={24} color={color} />;
    case "warning":
      return <WarningIcon size={24} color={color} />;
    case "vital":
      return <CheckIcon size={24} color={color} />;
  }
}

function VitalIconComponent({
  vitalType,
  size = 24,
}: {
  vitalType: VitalType;
  size?: number;
}) {
  switch (vitalType) {
    case "discipline":
      return <DisciplineIcon size={size} color={Colors.primary} />;
    case "mindset":
      return <MindsetIcon size={size} color={Colors.primary} />;
    case "strength":
      return <StrengthIcon size={size} color={Colors.primary} />;
    case "momentum":
      return <MomentumIcon size={size} color={Colors.primary} />;
    case "confidence":
      return <ConfidenceIcon size={size} color={Colors.primary} />;
    case "society":
      return <VitalIcon size={size} color={Colors.primary} />;
  }
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const slideYAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "error":
        return "rgba(239, 68, 68, 0.2)"; // red-500/20
      case "success":
        return "rgba(34, 197, 94, 0.2)"; // green-500/20
      case "warning":
        return "rgba(245, 158, 11, 0.2)"; // yellow-500/20
      case "info":
        return "rgba(59, 130, 246, 0.2)"; // blue-500/20
      case "vital":
        return "rgba(255, 92, 42, 0.2)"; // primary/20
    }
  };

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
        style={[
          tw`border border-white/10 rounded-md overflow-hidden relative`,
          { backgroundColor: getBackgroundColor() },
        ]}
        tint="dark"
      >
        <View style={tw`flex-row items-center px-4 py-3`}>
          <View style={tw`mr-3`}>
            <NotificationIcon type={notification.type} />
          </View>
          <Text style={tw`text-white font-mont-medium text-sm flex-1`}>
            {notification.message}
          </Text>
          <TouchableOpacity
            onPress={handleDismiss}
            style={tw`ml-2 p-1 absolute top-1 right-1`}
          >
            <XIcon size={16} color="#979797" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
}

function VitalNotificationItem({
  notification,
  onDismiss,
}: VitalNotificationItemProps) {
  const slideYAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressBarAnim = useRef(new Animated.Value(0 / 100)).current;

  const vitalName = VITAL_NAMES[notification.vitalType];

  const getBackgroundColor = () => {
    return "rgba(255, 92, 42, 0.2)"; // primary/20
  };

  const handleDismiss = useCallback(() => {
    // Slide out to top, fade out, and scale down
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
    // Step 1: Slide in, fade in, and scale up
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
    ]).start(() => {
      // Step 2: Animate progress bar with delay
      setTimeout(() => {
        Animated.timing(progressBarAnim, {
          toValue: notification.currentScore / 100,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }, 100);
    });

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
    progressBarAnim,
    notification.duration,
    notification.currentScore,
    handleDismiss,
  ]);

  return (
    <Animated.View
      style={[
        tw`mb-2 relative rounded-md`,
        {
          transform: [{ translateY: slideYAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <BlurView
        intensity={80}
        style={[
          tw`border border-white/10 rounded-md`,
          { backgroundColor: getBackgroundColor() },
        ]}
        tint="dark"
      >
        <View style={tw`flex-row items-center px-3 py-3`}>
          {/* Icon on the left */}
          <View style={tw`mr-5`}>
            <VitalIconComponent vitalType={notification.vitalType} size={32} />
          </View>

          {/* Content */}
          <View style={tw`flex-1`}>
            {/* Vital name + amount with gradient */}
            <View style={tw`flex-row items-end mb-2 gap-3`}>
              <Text style={tw`text-white font-tussi text-sm mb-[1px]`}>
                {vitalName}
              </Text>

              <Text style={tw`text-white font-tussi text-base`}>
                +{notification.amount}
              </Text>
            </View>

            {/* Progress bar */}
            <View style={tw`flex-row items-center`}>
              <View
                style={tw`flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-2`}
              >
                <Animated.View
                  style={[
                    tw`h-full rounded-full`,
                    {
                      backgroundColor: Colors.primary,
                      width: progressBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={tw`text-white/60 font-tussi text-xs`}>
                {Math.round(notification.currentScore)}
              </Text>
            </View>
          </View>

          {/* Dismiss button */}
          <TouchableOpacity
            onPress={handleDismiss}
            style={tw`ml-2 p-1 absolute -right-2 -top-2 p-1 bg-black/90 border border-white/10 rounded-full `}
          >
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
      style={[tw`absolute left-0 right-0 px-2 z-50`, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      {[...notifications].reverse().map((notification) => {
        if (notification.type === "vital") {
          return (
            <VitalNotificationItem
              key={notification.id}
              notification={notification as VitalNotification}
              onDismiss={removeNotification}
            />
          );
        }
        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        );
      })}
    </View>
  );
}
