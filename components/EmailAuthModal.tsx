import tw from "@/constants/tw";
import {
  emailSignIn,
  forgotPassword,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "@/services/api";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ForgotPasswordView } from "./auth/ForgotPasswordView";
import { ResetPasswordView } from "./auth/ResetPasswordView";
import { SignInView } from "./auth/SignInView";
import { VerifyEmailView } from "./auth/VerifyEmailView";

interface EmailAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ViewType =
  | "signin"
  | "verify-email"
  | "forgot-password"
  | "reset-password";

export function EmailAuthModal({
  visible,
  onClose,
  onSuccess,
}: EmailAuthModalProps) {
  const [currentView, setCurrentView] = useState<ViewType>("signin");
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Reset form state when modal closes
  const handleClose = () => {
    setCurrentView("signin");
    setEmail("");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    onClose();
  };

  // Continue - Unified sign in/sign up flow
  const handleContinue = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      // Call unified email-signin endpoint
      const response = await emailSignIn({ email, password });

      if (response.success) {
        // Check if verification is required
        const responseData = response as any;

        if (responseData.requiresVerification) {
          setCurrentView("verify-email");
        } else {
          // Sign in successful with token
          handleClose();
          onSuccess();
        }
      } else {
        // Sign in failed
        Alert.alert("Error", response.error || "Authentication failed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify Email
  const handleVerifyEmail = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmail({ email, otp });

      if (response.success) {
        handleClose();
        onSuccess();
      } else {
        Alert.alert("Error", response.error || "Verification failed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Code
  const handleResendCode = async () => {
    try {
      setLoading(true);
      const response = await resendVerification({ email });

      if (response.success) {
        Alert.alert("Success", "Verification code resent!");
      } else {
        Alert.alert("Error", response.error || "Failed to resend code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword({ email });

      if (response.success) {
        setCurrentView("reset-password");
      } else {
        Alert.alert("Error", response.error || "Failed to send reset code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({ email, otp, newPassword });

      if (response.success) {
        Alert.alert("Success", "Password reset successful! Please sign in.", [
          {
            text: "OK",
            onPress: () => {
              setPassword("");
              setCurrentView("signin");
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.error || "Password reset failed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Render different views
  const renderContent = () => {
    switch (currentView) {
      case "signin":
        return (
          <SignInView
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onContinue={handleContinue}
            onForgotPassword={() => setCurrentView("forgot-password")}
            loading={loading}
          />
        );

      case "verify-email":
        return (
          <VerifyEmailView
            email={email}
            otp={otp}
            onOtpChange={setOtp}
            onVerify={handleVerifyEmail}
            onResend={handleResendCode}
            onBackToSignIn={() => setCurrentView("signin")}
            loading={loading}
          />
        );

      case "forgot-password":
        return (
          <ForgotPasswordView
            email={email}
            onEmailChange={setEmail}
            onSendCode={handleForgotPassword}
            onBackToSignIn={() => setCurrentView("signin")}
            loading={loading}
          />
        );

      case "reset-password":
        return (
          <ResetPasswordView
            email={email}
            otp={otp}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onOtpChange={setOtp}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onReset={handleResetPassword}
            onBackToSignIn={() => setCurrentView("signin")}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <BlurView
        intensity={10}
        style={tw`flex-1 bg-black/90 justify-center items-center p-4`}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`w-full max-w-md`}
        >
          <BlurView
            onTouchEnd={(e) => e.stopPropagation()}
            intensity={60}
            style={tw`w-full max-w-md`}
            tint="dark"
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              style={tw`absolute top-1 right-2 z-10 rounded-full p-2`}
            >
              <Text style={tw`text-white font-mont-bold text-lg`}>✕</Text>
            </TouchableOpacity>

            <ScrollView
              style={tw`p-6 border border-white/5 rounded-md`}
              showsVerticalScrollIndicator={false}
            >
              {renderContent()}
            </ScrollView>
          </BlurView>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}
