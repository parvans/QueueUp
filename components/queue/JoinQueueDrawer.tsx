import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export interface PatientProfile {
  id: string;
  name: string;
  phone: string;
  relation: string;
  initials: string;
}

export const MOCK_PATIENTS: PatientProfile[] = [
  {
    id: "p1",
    name: "Parvan K.",
    phone: "+1 555-0192",
    relation: "Self",
    initials: "PK",
  },
  {
    id: "p2",
    name: "Sarah K.",
    phone: "+1 555-0193",
    relation: "Spouse",
    initials: "SK",
  },
  {
    id: "p3",
    name: "Leo K.",
    phone: "+1 555-0194",
    relation: "Child",
    initials: "LK",
  },
];

export interface FacilityDrawerData {
  id: string;
  name: string;
  category?: string;
  address?: string;
  distance?: string;
  leadDoctor?: string;
  doctors?: { name: string; dept: string }[];
  defaultMetrics?: {
    inLine: number;
    estWaitMins: number;
    serving: string;
    next: string;
    capacityCurrent?: number;
    capacityMax?: number;
  };
}

export interface JoinQueueDrawerProps {
  visible: boolean;
  onClose: () => void;
  facility: FacilityDrawerData;
  onConfirmSuccess?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const JoinQueueDrawer: React.FC<JoinQueueDrawerProps> = ({
  visible,
  onClose,
  facility,
  onConfirmSuccess,
}) => {
  const insets = useSafeAreaInsets();

  // Internal visual state: "confirm" | "joining"
  const [drawerMode, setDrawerMode] = useState<"confirm" | "joining">("confirm");
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(MOCK_PATIENTS[0]);
  const [isChangingPatient, setIsChangingPatient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joiningStep, setJoiningStep] = useState(1);

  // Animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const confirmTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Radar / pulse animations for joining state
  const pulseScale1 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.7)).current;
  const pulseScale2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.5)).current;
  const logoBounce = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // Unmount cleanup: clear all pending confirmation timers
  useEffect(() => {
    return () => {
      confirmTimersRef.current.forEach(clearTimeout);
      confirmTimersRef.current = [];
    };
  }, []);

  // Metrics derived from facility
  const inLineCount = facility.defaultMetrics?.inLine ?? 18;
  const waitMinutes = facility.defaultMetrics?.estWaitMins ?? 25;

  const serviceName =
    facility.id === "st-jude-hospital"
      ? "Cardiology OPD Consultation"
      : facility.id === "express-medical"
      ? "Pediatric Triage & Urgent"
      : facility.doctors?.[0]?.dept
      ? `${facility.doctors[0].dept} Consultation`
      : "General OPD Consultation";

  const expectedTurnTime =
    facility.id === "st-jude-hospital"
      ? "Around 12:40 PM"
      : facility.id === "express-medical"
      ? "Around 10:35 AM"
      : "Around 11:15 AM";

  const alertThreshold =
    inLineCount > 30 ? "5th in line" : inLineCount > 10 ? "3rd in line" : "2nd in line";

  // Dismiss drawer with downward slide animation
  const handleDismiss = useCallback(() => {
    if (isSubmitting) return;

    confirmTimersRef.current.forEach(clearTimeout);
    confirmTimersRef.current = [];

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(drawerTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerMode("confirm");
      setIsChangingPatient(false);
      onClose();
    });
  }, [backdropOpacity, drawerTranslateY, isSubmitting, onClose]);

  // Open drawer animation when visible changes to true
  useEffect(() => {
    if (visible) {
      setDrawerMode("confirm");
      setIsSubmitting(false);
      setIsChangingPatient(false);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.spring(drawerTranslateY, {
          toValue: 0,
          damping: 24,
          mass: 0.8,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      drawerTranslateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible, backdropOpacity, drawerTranslateY]);

  // Radar pulse loops when in joining mode
  useEffect(() => {
    if (drawerMode === "joining") {
      const pulse1 = Animated.loop(
        Animated.parallel([
          Animated.timing(pulseScale1, {
            toValue: 1.8,
            duration: 1400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity1, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      );

      const pulse2 = Animated.loop(
        Animated.sequence([
          Animated.delay(350),
          Animated.parallel([
            Animated.timing(pulseScale2, {
              toValue: 1.5,
              duration: 1400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity2, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      const bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(logoBounce, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoBounce, {
            toValue: 0.95,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const spinner = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      pulse1.start();
      pulse2.start();
      bounce.start();
      spinner.start();

      return () => {
        pulse1.stop();
        pulse2.stop();
        bounce.stop();
        spinner.stop();
      };
    }
  }, [drawerMode, logoBounce, pulseOpacity1, pulseOpacity2, pulseScale1, pulseScale2, spinValue]);

  // Handle Confirm & Join CTA
  const handleConfirmPress = () => {
    if (isSubmitting) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Fallback
    }

    confirmTimersRef.current.forEach(clearTimeout);
    confirmTimersRef.current = [];

    setIsSubmitting(true);
    setDrawerMode("joining");
    setJoiningStep(1);

    // Progression of joining steps
    const step2Timer = setTimeout(() => {
      setJoiningStep(2);
    }, 700);

    const step3Timer = setTimeout(() => {
      setJoiningStep(3);
    }, 1400);

    // Complete booking and navigate to Booking Success
    const navigateTimer = setTimeout(() => {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {
        // Fallback
      }

      // Close drawer animation
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(drawerTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsSubmitting(false);
        setDrawerMode("confirm");
        onClose();
        if (onConfirmSuccess) {
          onConfirmSuccess();
        } else {
          router.push(`/booking-success/${facility.id}` as any);
        }
      });
    }, 2200);

    confirmTimersRef.current = [step2Timer, step3Timer, navigateTimer];
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        {/* Dimmed Screen Backdrop */}
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View
            style={{ opacity: backdropOpacity }}
            className="absolute inset-0 bg-[#131B2E]/50"
          />
        </TouchableWithoutFeedback>

        {/* Sliding Bottom Drawer */}
        <Animated.View
          style={{
            transform: [{ translateY: drawerTranslateY }],
            paddingBottom: Math.max(insets.bottom, 16),
            maxHeight: SCREEN_HEIGHT * 0.9,
          }}
          className="bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(19,27,46,0.16)] px-5 pt-3 border-t border-[#EAEDFF]"
        >
          {/* Top Drag Handle Indicator */}
          <View className="w-12 h-1.5 rounded-full bg-[#C3C6D7] mx-auto mb-3 self-center" />

          {/* ========================================================
               MODE 1: CONFIRMATION DETAILS
               ======================================================== */}
          {drawerMode === "confirm" && (
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {/* Header with Brand Icon & Close Action */}
              <View className="flex-row items-start justify-between gap-3 mb-3.5">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-2xl bg-[#DBE1FF] items-center justify-center shadow-xs">
                    <Ionicons name="checkmark-done-circle" size={26} color="#004AC6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[20px] font-extrabold text-[#131B2E] tracking-tight">
                      Join Virtual Queue?
                    </Text>
                    <Text className="text-[12px] text-[#434655] mt-0.5">
                      You are about to join the virtual line at{" "}
                      <Text className="font-bold text-[#131B2E]">
                        {facility.name}
                      </Text>
                      .
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  accessibilityLabel="Close sheet"
                  activeOpacity={0.7}
                  onPress={handleDismiss}
                  className="w-8 h-8 rounded-full bg-[#F2F3FF] items-center justify-center active:bg-[#EAEDFF]"
                >
                  <Ionicons name="close" size={18} color="#434655" />
                </TouchableOpacity>
              </View>

              {/* Service Summary Card (Elevated Level 1) */}
              <View className="rounded-2xl bg-[#F2F3FF] p-3.5 gap-3 mb-3 border border-[#EAEDFF]">
                {/* Service Title Row */}
                <View className="flex-row items-center justify-between pb-2.5 border-b border-[#EAEDFF]">
                  <View className="flex-1 pr-2">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                      SELECTED SERVICE
                    </Text>
                    <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                      {serviceName}
                    </Text>
                  </View>
                  <Image
                    source={require("@/assets/images/queueup-logo.png")}
                    style={{ width: 22, height: 22, opacity: 0.85 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Telemetry Stats Row */}
                <View className="flex-row gap-2.5">
                  <View className="flex-1 flex-row items-center gap-2.5 p-2.5 rounded-xl bg-white shadow-2xs border border-[#EAEDFF]">
                    <View className="w-8 h-8 rounded-full bg-[#E2E7FF] items-center justify-center">
                      <Ionicons name="hourglass-outline" size={17} color="#3755C3" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-[#434655] uppercase">
                        ESTIMATED WAIT
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <View className="w-2 h-2 rounded-full bg-[#3755C3]" />
                        <Text className="text-[13px] font-bold text-[#131B2E]">
                          {waitMinutes} min
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-1 flex-row items-center gap-2.5 p-2.5 rounded-xl bg-white shadow-2xs border border-[#EAEDFF]">
                    <View className="w-8 h-8 rounded-full bg-[#DBE1FF] items-center justify-center">
                      <Ionicons name="people" size={17} color="#004AC6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-[#434655] uppercase">
                        PEOPLE AHEAD
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <View className="w-2 h-2 rounded-full bg-[#004AC6]" />
                        <Text className="text-[13px] font-bold text-[#004AC6]">
                          {inLineCount} people
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Timing & Telemetry Details */}
                <View className="gap-1.5 pt-0.5">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={16} color="#004AC6" />
                    <Text className="text-[12px] text-[#434655]">
                      Expected turn:{" "}
                      <Text className="font-bold text-[#131B2E]">
                        {expectedTurnTime}
                      </Text>
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="notifications" size={16} color="#007D55" />
                    <Text className="text-[12px] text-[#434655]">
                      SMS & push alerts when you are{" "}
                      <Text className="font-bold text-[#131B2E]">
                        {alertThreshold}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Patient Identity Chip / Card */}
              <View className="p-3 rounded-2xl bg-white border border-[#EAEDFF] shadow-2xs mb-3.5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                    <View className="w-9 h-9 rounded-full bg-[#004AC6] items-center justify-center">
                      <Text className="text-white text-[12px] font-bold">
                        {selectedPatient.initials}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-0">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                          ATTENDING PATIENT
                        </Text>
                        <View className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[14px] font-bold text-[#131B2E] mt-0.5"
                      >
                        {selectedPatient.name}{" "}
                        <Text className="text-[12px] text-[#434655] font-normal">
                          ({selectedPatient.phone})
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    accessibilityLabel="Change attending patient"
                    activeOpacity={0.7}
                    onPress={() => {
                      try {
                        Haptics.selectionAsync().catch(() => {});
                      } catch {
                        // Fallback
                      }
                      setIsChangingPatient(!isChangingPatient);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F2F3FF] active:bg-[#EAEDFF]"
                  >
                    <Text className="text-[12px] font-bold text-[#004AC6]">
                      {isChangingPatient ? "Done" : "Change"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Inline Patient Selection Drawer */}
                {isChangingPatient && (
                  <View className="mt-3 pt-3 border-t border-[#EAEDFF] gap-2">
                    <Text className="text-[11px] font-bold text-[#434655] uppercase mb-0.5">
                      Switch Dependent / Patient:
                    </Text>
                    {MOCK_PATIENTS.map((p) => {
                      const isSelected = selectedPatient.id === p.id;
                      return (
                        <TouchableOpacity
                          key={p.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            try {
                              Haptics.selectionAsync().catch(() => {});
                            } catch {
                              // Fallback
                            }
                            setSelectedPatient(p);
                            setIsChangingPatient(false);
                          }}
                          className={`p-2.5 rounded-xl flex-row items-center justify-between border ${
                            isSelected
                              ? "bg-[#DBE1FF]/40 border-[#004AC6]"
                              : "bg-[#F2F3FF] border-[#EAEDFF]"
                          }`}
                        >
                          <View className="flex-row items-center gap-2">
                            <View className="w-7 h-7 rounded-full bg-[#004AC6] items-center justify-center">
                              <Text className="text-white text-[10px] font-bold">
                                {p.initials}
                              </Text>
                            </View>
                            <Text className="text-[13px] font-semibold text-[#131B2E]">
                              {p.name} ({p.relation})
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color="#004AC6"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="gap-2">
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                  onPress={handleConfirmPress}
                  className="w-full h-13 py-3.5 rounded-full bg-[#004AC6] flex-row items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text className="text-white text-[15px] font-bold">
                    Confirm & Join Queue
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDismiss}
                  className="w-full h-11 rounded-full items-center justify-center active:bg-[#F2F3FF]"
                >
                  <Text className="text-[#434655] text-[14px] font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* ========================================================
               MODE 2: JOINING / LOADING STATE (Stitch State 2)
               ======================================================== */}
          {drawerMode === "joining" && (
            <View className="items-center text-center py-2 pb-4">
              {/* Animated Radar / Pulse Ring Indicator */}
              <View className="w-28 h-28 items-center justify-center my-2 relative">
                {/* Outer pulsing halo */}
                <Animated.View
                  style={{
                    transform: [{ scale: pulseScale1 }],
                    opacity: pulseOpacity1,
                  }}
                  className="absolute w-24 h-24 rounded-full bg-blue-500/20"
                />
                {/* Middle ripple ring */}
                <Animated.View
                  style={{
                    transform: [{ scale: pulseScale2 }],
                    opacity: pulseOpacity2,
                  }}
                  className="absolute w-18 h-18 rounded-full bg-blue-500/30"
                />
                {/* Central circular card housing QueueUp logo */}
                <Animated.View
                  style={{ transform: [{ scale: logoBounce }] }}
                  className="w-14 h-14 rounded-full bg-white shadow-lg items-center justify-center p-2.5 border border-[#EAEDFF]"
                >
                  <Image
                    source={require("@/assets/images/queueup-logo.png")}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              {/* Real-time Badge */}
              <View className="px-3 py-1 rounded-full bg-[#DBE1FF] mb-2">
                <Text className="text-[10px] font-bold text-[#00174B] uppercase tracking-wider">
                  SECURING SPOT IN REAL TIME
                </Text>
              </View>

              <Text className="text-[20px] font-extrabold text-[#131B2E] mb-1">
                Joining queue...
              </Text>
              <Text className="text-[12px] text-[#434655] text-center max-w-xs mb-4">
                Reserving your position with{" "}
                <Text className="font-bold text-[#131B2E]">{facility.name}</Text>.
                Ticket issuance in progress.
              </Text>

              {/* Live Step Progress Tracker */}
              <View className="w-full bg-[#F2F3FF] rounded-2xl p-3.5 mb-3.5 gap-2.5 border border-[#EAEDFF]">
                {/* Step 1: Active Capacity */}
                <View className="flex-row items-center gap-2.5">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      joiningStep >= 1 ? "bg-[#007D55]" : "bg-[#EAEDFF]"
                    }`}
                  >
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                  <Text
                    className={`text-[12px] ${
                      joiningStep >= 1
                        ? "text-[#131B2E] font-bold"
                        : "text-[#737686]"
                    }`}
                  >
                    Verifying clinic active capacity
                  </Text>
                </View>

                {/* Step 2: Ticket Number */}
                <View className="flex-row items-center gap-2.5">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      joiningStep >= 2 ? "bg-[#004AC6]" : "bg-[#EAEDFF]"
                    }`}
                  >
                    {joiningStep >= 2 ? (
                      <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Ionicons name="sync" size={13} color="#FFFFFF" />
                      </Animated.View>
                    ) : (
                      <Ionicons name="ellipsis-horizontal" size={13} color="#737686" />
                    )}
                  </View>
                  <Text
                    className={`text-[12px] ${
                      joiningStep >= 2
                        ? "text-[#004AC6] font-bold"
                        : "text-[#737686]"
                    }`}
                  >
                    Assigning next available ticket number
                  </Text>
                </View>

                {/* Step 3: Wait Estimate */}
                <View
                  className={`flex-row items-center gap-2.5 ${
                    joiningStep >= 3 ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      joiningStep >= 3 ? "bg-[#007D55]" : "bg-[#E2E7FF]"
                    }`}
                  >
                    {joiningStep >= 3 ? (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="hourglass-outline" size={12} color="#737686" />
                    )}
                  </View>
                  <Text
                    className={`text-[12px] ${
                      joiningStep >= 3
                        ? "text-[#131B2E] font-bold"
                        : "text-[#434655]"
                    }`}
                  >
                    Syncing live wait estimate
                  </Text>
                </View>
              </View>

              {/* Gentle Reassurance Prompt */}
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="lock-closed" size={14} color="#004AC6" />
                <Text className="text-[11px] font-medium text-[#434655]">
                  Do not close the app or refresh the screen
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};
