import {
  checkWinterArcAccess,
  getOfferings,
  purchasePackage,
  restorePurchases as restorePurchasesService,
} from "@/services/revenuecat";
import { useCallback, useEffect, useState } from "react";
import { PurchasesPackage } from "react-native-purchases";

interface UseInAppPurchaseReturn {
  winterArcPurchased: boolean;
  packages: PurchasesPackage[];
  selectedPackage: PurchasesPackage | null;
  isLoading: boolean;
  isPurchasing: boolean;
  purchase: (pkg?: PurchasesPackage) => Promise<{
    success: boolean;
    error?: any;
  }>;
  restorePurchases: () => Promise<{ success: boolean; error?: any }>;
  checkAccess: () => Promise<void>;
  setSelectedPackage: (pkg: PurchasesPackage | null) => void;
}

export function useInAppPurchase(): UseInAppPurchaseReturn {
  const [winterArcPurchased, setWinterArcPurchased] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Check if user has Winter Arc access
  const checkAccess = async () => {
    setIsLoading(true);
    try {
      const hasAccess = await checkWinterArcAccess();
      setWinterArcPurchased(hasAccess);

      // Only load packages if user doesn't have access
      if (!hasAccess) {
        const availablePackages = await getOfferings();
        setPackages(availablePackages);

        // Auto-select first package
        if (availablePackages.length > 0 && !selectedPackage) {
          setSelectedPackage(availablePackages[0]);
        }
      }
    } catch (error) {
      console.error("Error checking Winter Arc access:", error);
      setWinterArcPurchased(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase a package
  const purchase = useCallback(
    async (pkg?: PurchasesPackage) => {
      const packageToPurchase = pkg || selectedPackage;

      if (!packageToPurchase) {
        return { success: false, error: "No package selected" };
      }

      setIsPurchasing(true);

      try {
        const result = await purchasePackage(packageToPurchase);

        if (result.success) {
          setWinterArcPurchased(true);
        }

        return result;
      } catch (error) {
        console.error("Purchase error:", error);
        return { success: false, error };
      } finally {
        setIsPurchasing(false);
      }
    },
    [selectedPackage]
  );

  // Restore previous purchases
  const restorePurchases = useCallback(async () => {
    setIsPurchasing(true);

    try {
      await restorePurchasesService();
      const hasAccess = await checkWinterArcAccess();

      setWinterArcPurchased(hasAccess);

      return { success: hasAccess };
    } catch (error) {
      console.error("Restore error:", error);
      return { success: false, error };
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  // Check access on mount
  useEffect(() => {
    checkAccess();
  }, []);

  return {
    winterArcPurchased,
    packages,
    selectedPackage,
    isLoading,
    isPurchasing,
    purchase,
    restorePurchases,
    checkAccess,
    setSelectedPackage,
  };
}
