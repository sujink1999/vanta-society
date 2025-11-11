import { Button } from "@/components/Button";
import { PhoneModal } from "@/components/PhoneModal";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import tw from "@/constants/tw";
import { deleteAccount } from "@/services/api/users";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onDeleteSuccess,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteAccount();
      if (response.success) {
        onDeleteSuccess();
      } else {
        setError(
          response.error || "Failed to delete account. Please try again."
        );
      }
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneModal visible={visible} onClose={onClose}>
      <PlatformBlurView
        intensity={10}
        opacity={0.9}
        onTouchEnd={onClose}
        style={tw`flex-1 bg-black/80 justify-center items-center p-4`}
        tint="dark"
      >
        <PlatformBlurView
          onTouchEnd={(e) => e.stopPropagation()}
          intensity={60}
          style={tw`w-full `}
          tint="dark"
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-1 right-2 z-10 rounded-full p-2`}
            disabled={loading}
          >
            <Text style={tw`text-white font-mont-bold text-lg`}>✕</Text>
          </TouchableOpacity>

          <View
            style={tw`border border-white/10 rounded-md overflow-hidden p-6`}
          >
            {/* Title */}
            <Text style={tw`text-white font-tussi-bold text-xl mb-2`}>
              Delete Account
            </Text>

            {/* Warning Message */}
            <Text style={tw`text-textSecondary font-mont text-sm mb-6`}>
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently deleted including:
            </Text>

            <View style={tw`mb-6`}>
              <Text style={tw`text-textSecondary font-mont text-sm mb-1`}>
                • Your profile and personal information
              </Text>
              <Text style={tw`text-textSecondary font-mont text-sm mb-1`}>
                • All Project66 progress and stats
              </Text>
              <Text style={tw`text-textSecondary font-mont text-sm mb-1`}>
                • Your routine and task history
              </Text>
              <Text style={tw`text-textSecondary font-mont text-sm`}>
                • All vitals scores and achievements
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View
                style={tw`bg-red-500/20 border border-red-500/50 rounded-sm p-3 mb-4`}
              >
                <Text style={tw`text-red-500 font-mont text-sm`}>{error}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={tw`flex-col gap-2`}>
              <Button
                title={loading ? "DELETING..." : "DELETE ACCOUNT"}
                onPress={handleDelete}
                loading={loading}
                disabled={loading}
                style={tw`bg-red-500`}
              />
              <Button
                title="CANCEL"
                onPress={onClose}
                disabled={loading}
                style={tw`bg-white/10`}
              />
            </View>
          </View>
        </PlatformBlurView>
      </PlatformBlurView>
    </PhoneModal>
  );
}
