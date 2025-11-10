import { BrandCarousel } from "@/components/BrandCarousel";
import { BrandModal } from "@/components/BrandModal";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import tw from "@/constants/tw";
import {
  getMarketplaceBrands,
  getProducts,
  MarketplaceItem,
  Product,
} from "@/services/api";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StoreScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<MarketplaceItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<MarketplaceItem | null>(
    null
  );
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [brandModalVisible, setBrandModalVisible] = useState(false);

  // Load products (coming soon items)
  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const response = await getProducts({
        sort: "priority",
        order: "desc",
      });
      setProducts(response.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Load marketplace brands
  const loadBrands = useCallback(async () => {
    try {
      setBrandsLoading(true);
      const response = await getMarketplaceBrands();
      setBrands(response.brands);
    } catch (error) {
      console.error("Failed to load brands:", error);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadBrands();
  }, [loadProducts, loadBrands]);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const handleBrandPress = (brand: MarketplaceItem) => {
    setSelectedBrand(brand);
    setBrandModalVisible(true);
  };

  const handleNotificationChange = () => {
    // Reload products to get updated notification status
    loadProducts();
  };

  const showProducts = products.length > 0;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1 `}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={tw` flex-row items-center px-3 pt-[13px] pb-6`}>
            <Image
              source={require("@/assets/images/society-logo-no-bg.png")}
              style={tw`w-16 h-10`}
              resizeMode="contain"
            />
          </View>
          {/* Marketplace Brands Section */}
          <View style={tw`mb-10`}>
            <View
              style={tw`px-4 mb-3 flex-row items-center justify-between mb-6`}
            >
              <View style={tw`flex-col gap-1`}>
                <Text style={tw`text-textPrimary font-tussi-bold text-lg`}>
                  MARKETPLACE
                </Text>
                <Text style={tw`text-white/90 font-mont text-[11px]`}>
                  all our marketplace products are of highest curation standards
                </Text>
              </View>
            </View>

            <BrandCarousel
              brands={brands}
              loading={brandsLoading}
              onBrandPress={handleBrandPress}
            />
          </View>

          {/* Society Products Section */}
          {showProducts && (
            <View style={tw`mb-6 mt-4`}>
              <View style={tw`px-4 mb-3 flex-col gap-1 mb-6`}>
                <Text style={tw`text-textPrimary font-tussi-bold text-lg`}>
                  PRODUCTS
                </Text>
                <Text style={tw`text-white/90 font-mont text-[11px]`}>
                  From the house of Vanta
                </Text>
              </View>

              <ProductGrid
                products={products}
                loading={productsLoading}
                onProductPress={handleProductPress}
              />
            </View>
          )}
        </ScrollView>

        {/* Modals */}
        <ProductModal
          visible={productModalVisible}
          product={selectedProduct}
          onClose={() => setProductModalVisible(false)}
          onNotificationChange={handleNotificationChange}
        />

        <BrandModal
          visible={brandModalVisible}
          brand={selectedBrand}
          onClose={() => setBrandModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
