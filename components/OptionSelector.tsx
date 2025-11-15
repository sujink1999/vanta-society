import { PlatformBlurView } from "@/components/PlatformBlurView";
import {
  OPTION_NAMES,
  OPTION_TYPES,
  OPTION_VALUES,
} from "@/constants/optionTypes";
import tw from "@/constants/tw";
import { TaskOption } from "@/services/api/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDownIcon } from "./icons/Icons";

interface OptionSelectorProps {
  option: TaskOption;
  currentValue: any;
  onChange: (newValue: any) => void;
  accentColor: string;
}

const getOptionsForType = (type: string) => {
  return OPTION_VALUES[type] || [];
};

const parseTimeString = (timeStr: string) => {
  if (!timeStr) return new Date();
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/);
  if (!match) return new Date();

  const [, hour, minute, period] = match;
  const date = new Date();
  let hourInt = parseInt(hour);

  if (period === "PM" && hourInt !== 12) hourInt += 12;
  if (period === "AM" && hourInt === 12) hourInt = 0;

  date.setHours(hourInt, parseInt(minute), 0, 0);
  return date;
};

const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export function OptionSelector({
  option,
  currentValue,
  onChange,
  accentColor,
}: OptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // For time_of_day, use DateTimePicker
  if (option.type === OPTION_TYPES.TIME_OF_DAY) {
    return (
      <View style={tw`flex-row  items-center gap-3`}>
        <Text style={tw`text-textSecondary font-mont-medium text-sm`}>
          {OPTION_NAMES[option.type] || option.name}
        </Text>

        <View style={tw`relative`}>
          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={[
              tw` rounded-md flex-row items-center border-b border-white pb-[2px] gap-1 pl-1`,
            ]}
          >
            <Text style={tw`text-white font-mont text-base `}>
              {currentValue || option.default || "6:00 AM"}
            </Text>
            <ChevronDownIcon size={16} color={"white"} />
          </TouchableOpacity>

          {isOpen && (
            <Modal
              visible={isOpen}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsOpen(false)}
            >
              <TouchableOpacity
                style={tw`flex-1 justify-end`}
                activeOpacity={1}
                onPress={() => setIsOpen(false)}
              >
                <PlatformBlurView
                  intensity={40}
                  style={tw`border-t border-white/10`}
                  tint="dark"
                >
                  <View style={tw`p-4`}>
                    <View
                      style={tw`flex-row justify-between items-center mb-4`}
                    >
                      <TouchableOpacity onPress={() => setIsOpen(false)}>
                        <Text style={tw`text-blue-500 font-mont-medium`}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <Text style={tw`text-white font-mont-medium`}>
                        Select Time
                      </Text>
                      <TouchableOpacity onPress={() => setIsOpen(false)}>
                        <Text style={tw`text-blue-500 font-mont-medium`}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <DateTimePicker
                        value={parseTimeString(
                          currentValue || option.default || "6:00 AM"
                        )}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={(_, selectedDate) => {
                          if (selectedDate) {
                            onChange(formatTime(selectedDate));
                          }
                        }}
                        textColor="white"
                      />
                    </View>
                  </View>
                </PlatformBlurView>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </View>
    );
  }

  // For text type, use text input
  if (option.type === OPTION_TYPES.TEXT) {
    return (
      <View style={tw`flex-row items-center gap-3`}>
        <Text style={tw`text-textSecondary font-mont-medium text-sm`}>
          {OPTION_NAMES[option.type] || option.name}
        </Text>
        <TextInput
          style={[
            tw`border-b border-white  pl-[2px] pb-2 text-white text-base font-mont flex-1 leading-5`,
          ]}
          value={currentValue?.toString() || ""}
          onChangeText={onChange}
          placeholder={option.default || ""}
          placeholderTextColor="#888"
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
        />
      </View>
    );
  }

  // For all other types, use dropdown
  const options = getOptionsForType(option.type);

  return (
    <View style={tw`flex-row  items-center gap-3`}>
      <Text style={tw`text-textSecondary font-mont-medium text-sm`}>
        {OPTION_NAMES[option.type] || option.name}
      </Text>

      <View style={tw`relative`}>
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          style={[
            tw` rounded-md flex-row items-center border-b border-white pb-[2px] gap-1 pl-1`,
          ]}
        >
          <Text style={tw`text-white font-mont text-base `}>
            {currentValue || option.default || "Select option"}
          </Text>
          <ChevronDownIcon size={16} color={"white"} />
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity
            style={tw`flex-1 bg-black/50`}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View style={tw`flex-1 justify-center items-center px-8`}>
              <PlatformBlurView
                intensity={40}
                style={tw`border border-white/10 rounded-lg max-h-60 w-full overflow-hidden`}
                tint="dark"
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  {options.map((optionValue) => (
                    <TouchableOpacity
                      key={optionValue}
                      onPress={() => {
                        onChange(optionValue);
                        setIsOpen(false);
                      }}
                      style={tw`px-4 py-3 border-b border-white/10`}
                    >
                      <Text style={tw`text-white font-mont text-center`}>
                        {optionValue}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </PlatformBlurView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}
