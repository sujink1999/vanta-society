import tw from "@/constants/tw";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { GoogleAuthService } from "@/services/auth/GoogleAuthService";
import { apiClient } from "@/services/api/client";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user, refetchUser } = useGlobalContext();

  const handleSignOut = async () => {
    try {
      // Sign out from Google
      await GoogleAuthService.signOut();

      // Clear local token
      await apiClient.clearToken();

      // Refresh user state
      await refetchUser();

      // Navigate to login
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-black p-4`}>
      <Text
        style={tw`text-textPrimary mb-4 text-center font-tussi-bold text-10 `}
      >
        VANTA SOCIETY
      </Text>
      <Text style={tw`text-textSecondary text-base font-mont text-center mb-8`}>
        Welcome to the future of professional networking
      </Text>

      {user && (
        <View style={tw`items-center mb-8`}>
          <Text style={tw`text-textPrimary text-lg font-mont-medium mb-2`}>
            Welcome back!
          </Text>
          <Text style={tw`text-textSecondary text-base font-mont`}>
            {user.email}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={tw`bg-primary px-6 py-3 rounded-lg`}
        onPress={handleSignOut}
      >
        <Text style={tw`text-white font-mont-medium text-base`}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}