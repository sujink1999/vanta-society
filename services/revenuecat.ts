import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

// TODO: Replace with your actual RevenueCat API keys from the dashboard
// Get these from: RevenueCat Dashboard → Project Settings → API Keys
const REVENUECAT_API_KEY_IOS = "appl_RJeHOZtwPyPykGwCUAbWDGfjOCM";
const REVENUECAT_API_KEY_ANDROID = "goog_gMgHDXpSsghDfHGQroHLFBJOPCg";

// Entitlement identifier - this should match what you created in RevenueCat
// For Project66: the entitlement is "Winter Arc" (with space) - backend identifier unchanged
export const WINTER_ARC_ENTITLEMENT_ID = "Winter Arc";

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export const initializeRevenueCat = async (): Promise<void> => {
  try {
    const apiKey =
      Platform.OS === "ios"
        ? REVENUECAT_API_KEY_IOS
        : REVENUECAT_API_KEY_ANDROID;

    if (apiKey.includes("YOUR_")) {
      console.warn(
        "⚠️ RevenueCat API key not configured. Please add your API key in services/revenuecat.ts"
      );
      return;
    }

    // Configure RevenueCat
    Purchases.configure({
      apiKey,
    });

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log("✅ RevenueCat initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize RevenueCat:", error);
    throw error;
  }
};

/**
 * Get available offerings (products) from RevenueCat
 * @returns Array of available packages to purchase
 */
export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();

    console.log("🔍 Offerings:", offerings);

    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length > 0
    ) {
      console.log(
        "📦 Available packages:",
        offerings.current.availablePackages.length
      );
      return offerings.current.availablePackages;
    }

    console.warn("⚠️ No offerings available");
    return [];
  } catch (error) {
    console.error("❌ Error getting offerings:", error);
    return [];
  }
};

/**
 * Purchase a package
 * @param packageToPurchase - The package to purchase
 * @returns Object with success status and customer info
 */
export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: any }> => {
  try {
    console.log("🛒 Attempting to purchase:", packageToPurchase.identifier);

    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);

    // Check if user now has Project66 entitlement
    const hasWinterArc =
      customerInfo.entitlements.active[WINTER_ARC_ENTITLEMENT_ID] !== undefined;

    if (hasWinterArc) {
      console.log("✅ Purchase successful! User now has Project66 access");
      return { success: true, customerInfo };
    } else {
      console.warn(
        "⚠️ Purchase completed but Project66 entitlement not active"
      );
      return { success: false, customerInfo };
    }
  } catch (error: any) {
    // User cancelled - not an error
    if (error.userCancelled) {
      console.log("ℹ️ User cancelled purchase");
      return { success: false, error };
    }

    console.error("❌ Purchase error:", error);
    return { success: false, error };
  }
};

/**
 * Restore previous purchases
 * Useful when user reinstalls app or logs in on new device
 * @returns CustomerInfo with restored purchases
 */
export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    console.log("🔄 Restoring purchases...");
    const customerInfo = await Purchases.restorePurchases();

    const hasWinterArc =
      customerInfo.entitlements.active[WINTER_ARC_ENTITLEMENT_ID] !== undefined;

    if (hasWinterArc) {
      console.log("✅ Purchases restored! User has Project66 access");
    } else {
      console.log(
        "ℹ️ Purchases restored but no active Project66 entitlement found"
      );
    }

    return customerInfo;
  } catch (error) {
    console.error("❌ Error restoring purchases:", error);
    throw error;
  }
};

/**
 * Check if user has active Project66 access
 * @returns true if user has Project66 access, false otherwise
 */
export const checkWinterArcAccess = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasWinterArc =
      customerInfo.entitlements.active[WINTER_ARC_ENTITLEMENT_ID] !== undefined;

    console.log("🔍 Project66 access:", hasWinterArc);
    return hasWinterArc;
  } catch (error) {
    console.error("❌ Error checking Project66 access:", error);
    return false;
  }
};

/**
 * Get customer info (includes all purchase information)
 * @returns CustomerInfo object
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error("❌ Error getting customer info:", error);
    return null;
  }
};

/**
 * Identify user in RevenueCat
 * Call this after user logs in with a unique user ID
 * @param userId - Unique identifier for the user
 */
export const identifyUser = async (userId: string): Promise<void> => {
  try {
    await Purchases.logIn(userId);
    console.log("✅ User identified:", userId);
  } catch (error) {
    console.error("❌ Error identifying user:", error);
    throw error;
  }
};

/**
 * Log out current user (anonymous user will be created)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await Purchases.logOut();
    console.log("✅ User logged out");
  } catch (error) {
    console.error("❌ Error logging out user:", error);
    throw error;
  }
};
