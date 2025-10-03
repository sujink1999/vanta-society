import tw from "@/constants/tw";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode: string;
  onCountryChange: (countryCode: string, dialCode: string) => void;
  placeholder?: string;
  style?: any;
}

// Common countries data
const COUNTRIES: Country[] = [
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
];

export function PhoneNumberInput({
  value,
  onChangeText,
  countryCode,
  onCountryChange,
  placeholder = "Phone number (optional)",
  style,
}: PhoneNumberInputProps) {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentCountry =
    COUNTRIES.find((country) => country.dialCode === `+${countryCode}`) ||
    COUNTRIES[11];

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const selectCountry = (country: Country) => {
    onCountryChange(country.code, country.dialCode);
    setShowCountryPicker(false);
    setSearchQuery("");
  };

  return (
    <View style={style}>
      <View style={tw`flex-row`}>
        {/* Country Picker Button */}
        <TouchableOpacity
          style={tw`border border-white/20 rounded-sm px-3 py-3 mr-2 flex-row items-center min-w-20`}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={tw`text-white font-tussi text-sm mr-1`}>
            {currentCountry.flag}
          </Text>
          <Text style={tw`text-white font-tussi text-sm`}>
            {currentCountry.dialCode}
          </Text>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={tw`border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-md flex-1`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          autoCorrect={false}
        />
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={tw`flex-1 bg-black`}>
          <View style={tw`p-4 border-b border-white/20`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-white font-tussi-bold text-lg`}>
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Text style={tw`text-white font-tussi text-base`}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              style={tw`border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-sm my-2`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries..."
              placeholderTextColor="#666"
              autoCorrect={false}
            />
          </View>

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`p-4 border-b border-white/10 flex-row items-center`}
                onPress={() => selectCountry(item)}
              >
                <Text style={tw`text-2xl mr-3`}>{item.flag}</Text>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white font-mont text-base`}>
                    {item.name}
                  </Text>
                </View>
                <Text style={tw`text-white font-tussi text-base`}>
                  {item.dialCode}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}
