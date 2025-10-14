import { OPTION_TYPES } from "@/constants/optionTypes";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTasks } from "@/hooks/useTasks";
import moment from "moment";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { CheckIcon } from "./icons/Icons";
import { BedtimeIcon, SleepIcon } from "./icons/TaskIcons";

interface SleepTimelineProps {
  date: string;
}

export function SleepTimeline({ date }: SleepTimelineProps) {
  const { routine, winterArcStats } = useGlobalContext();
  const tasks = useTasks(date);

  const sleepData = useMemo(() => {
    // Find sleep and wake time tasks
    const sleepTask = tasks.find((t) => t.taskName === "Sleep for 8 hours");
    const wakeTimeTask = routine.find(
      (t) => t.taskName === "Consistent wake time"
    );

    // Get wake time value
    let wakeTime = null;
    if (wakeTimeTask) {
      const timeOption = wakeTimeTask.optionsSet.find(
        (opt) => opt.type === OPTION_TYPES.TIME_OF_DAY
      );
      if (timeOption && timeOption.value) {
        const parsedTime = moment(timeOption.value, [
          "h:mm A",
          "h:mm a",
          "hh:mm A",
          "hh:mm a",
        ]);
        if (parsedTime.isValid()) {
          wakeTime = parsedTime.format("h:mm A");
        }
      }
    }

    // Check if wake time task was completed
    const wakeTimeCompleted = tasks.find(
      (t) => t.taskName === "Consistent wake time" && t.status === "done"
    );

    return {
      sleepCompleted: sleepTask?.status === "done",
      wakeTime,
      wakeTimeCompleted: !!wakeTimeCompleted,
      bedtime: winterArcStats.idealBedtime,
    };
  }, [tasks, routine, winterArcStats.idealBedtime]);

  if (!sleepData.wakeTime) {
    return null; // Don't show timeline if no wake time is set
  }

  return (
    <View style={tw`relative w-full mb-8 mt-4`}>
      <View style={tw`flex-row items-center`}>
        <View style={[tw`w-[40%] h-7 bg-white/10 rounded-sm `]}></View>
        <View style={tw`w-[60%] h-6  flex-row justify-between`}>
          {Array.from({ length: 50 }).map((_, index) => (
            <View key={index} style={tw`w-[1px] h-6 bg-white/20`}></View>
          ))}
        </View>
      </View>
      <View
        style={tw`absolute top-0 left-0 w-full h-full  flex-row  items-center `}
      >
        <View
          style={tw` h-10 w-[40%] flex-row items-center justify-center gap-1 `}
        >
          {sleepData.sleepCompleted && <CheckIcon size={10} color="white" />}
          <Text style={tw`text-white text-[10px] font-tussi  pr-2`}>Sleep</Text>
        </View>
        <View
          style={tw`w-8 h-8 bg-white rounded-full -ml-4 flex justify-center items-center relative `}
        >
          <SleepIcon size={24} color="black" />

          <View
            style={tw`absolute -bottom-6 left-1/2 -translate-x-1/2 flex-row items-center justify-center w-[80px] gap-1`}
          >
            <Text style={tw`text-white text-[10px] font-tussi `}>
              {sleepData.wakeTime}
            </Text>
            {sleepData.wakeTimeCompleted && (
              <CheckIcon size={10} color="white" />
            )}
          </View>
        </View>
        <View style={tw`flex-1 `}></View>
        <View
          style={tw`w-8 h-8 bg-white rounded-full flex justify-center items-center relative `}
        >
          <BedtimeIcon size={24} color="black" />
          <View style={tw`absolute -bottom-9 right-0`}>
            <Text style={tw`text-white text-[10px] w-full font-tussi`}>
              {sleepData.bedtime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  //     {/* Timeline Container */}
  //     <View style={tw`flex-row items-center justify-between`}>
  //       {/* Sleep for 8 hours */}
  //       <View style={tw`flex-1 items-center`}>
  //         <View
  //           style={[
  //             tw`w-10 h-10 rounded-full items-center justify-center mb-2`,
  //             sleepData.sleepCompleted
  //               ? tw`bg-primary/20 border-2 border-primary`
  //               : tw`bg-white/5 border-2 border-white/10`,
  //           ]}
  //         >
  //           {sleepData.sleepCompleted ? (
  //             <CheckIcon size={20} color={Colors.primary} />
  //           ) : (
  //             <SleepIcon size={20} color="#666666" />
  //           )}
  //         </View>
  //         <Text
  //           style={[
  //             tw`text-xs font-mont text-center`,
  //             sleepData.sleepCompleted ? tw`text-primary` : tw`text-white/40`,
  //           ]}
  //         >
  //           8hr Sleep
  //         </Text>
  //       </View>

  //       {/* Connecting Line */}
  //       <View
  //         style={tw`flex-1 h-[2px] bg-white/10 -mt-7`}
  //       />

  //       {/* Wake Time */}
  //       <View style={tw`flex-1 items-center`}>
  //         <View
  //           style={[
  //             tw`w-10 h-10 rounded-full items-center justify-center mb-2`,
  //             sleepData.wakeTimeCompleted
  //               ? tw`bg-primary/20 border-2 border-primary`
  //               : tw`bg-white/5 border-2 border-white/10`,
  //           ]}
  //         >
  //           {sleepData.wakeTimeCompleted ? (
  //             <CheckIcon size={20} color={Colors.primary} />
  //           ) : (
  //             <Text
  //               style={tw`text-white/60 font-tussi text-xs`}
  //             >
  //               ⏰
  //             </Text>
  //           )}
  //         </View>
  //         <Text
  //           style={[
  //             tw`text-xs font-mont-medium text-center`,
  //             sleepData.wakeTimeCompleted ? tw`text-primary` : tw`text-white/60`,
  //           ]}
  //         >
  //           {sleepData.wakeTime}
  //         </Text>
  //         <Text
  //           style={[
  //             tw`text-[10px] font-mont text-center`,
  //             sleepData.wakeTimeCompleted ? tw`text-primary/60` : tw`text-white/40`,
  //           ]}
  //         >
  //           Wake
  //         </Text>
  //       </View>

  //       {/* Connecting Line */}
  //       <View
  //         style={tw`flex-1 h-[2px] bg-white/10 -mt-7`}
  //       />

  //       {/* Bed Time */}
  //       <View style={tw`flex-1 items-center`}>
  //         <View
  //           style={tw`w-10 h-10 rounded-full items-center justify-center mb-2 bg-white/5 border-2 border-white/10`}
  //         >
  //           <Text style={tw`text-white/60 font-tussi text-xs`}>
  //             🌙
  //           </Text>
  //         </View>
  //         <Text
  //           style={tw`text-xs font-mont-medium text-center text-white/60`}
  //         >
  //           {sleepData.bedtime}
  //         </Text>
  //         <Text
  //           style={tw`text-[10px] font-mont text-center text-white/40`}
  //         >
  //           Bedtime
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  // );
}
