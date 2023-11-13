// import { useState } from "react";
// import { Dimensions, View } from "react-native";
// import { PanGestureHandler } from "react-native-gesture-handler";
// import Animated, { runOnJS, useAnimatedGestureHandler, useSharedValue, withSpring } from "react-native-reanimated";

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const BUTTON_WIDTH = SCREEN_WIDTH - 48;
// const BUTTON_HEIGHT = 100;
// const BUTTON_PADDING = 10;
// const SWIPEABLE_DIMENSIONS = 100 - 2 * BUTTON_PADDING;

// const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
// const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

// const SwipeButton = ({onToggle}: any) => {
//   const sharedValue = useSharedValue(0);

//   const [toggled, setToggled] = useState(false);
//   const InterpolateXInput = [0, H_SWIPE_RANGE];
//     const handleComplete = (isToggled: any) => {
//     if (isToggled !== toggled) {
//       setToggled(isToggled);
//       onToggle(isToggled);
//     }
//   };
//   const animatedGestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//         ctx.completed = toggled;
//       },
//     onActive: (e, ctx) => {
//         let newValue;
//         if (ctx.completed) {
//           newValue = H_SWIPE_RANGE + e.translationX;
//         } else {
//           newValue = e.translationX;
//         }

//         if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
//           sharedValue.value = newValue;
//         }
//     },
//     onEnd: () => {
//       if (
//         sharedValue.value <
//         BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2 - 2 * BUTTON_PADDING
//       ) {
//         sharedValue.value = withSpring(0);
//         runOnJS(handleComplete)(false);
//       } else {
//         sharedValue.value = withSpring(H_SWIPE_RANGE);
//         runOnJS(handleComplete)(true);
//       }
//     },
//   });

//     // colors is from the version one use interpolatecolors
//   const animatedStylesSwipe = useAnimatedStyle(() => ({
//     transform: [{translateX: sharedValue.value}],
//     backgroundColor: interpolateColor(
//         sharedValue.value,
//         InterpolateXInput,
//         ['#1b9aaa', '#fff'],
//       ),
//   }));

//   return (
//     <View style={styles.containerStyle}>
//       <PanGestureHandler onGestureEvent={animatedGestureHandler}>
//         <Animated.View
//           style={[styles.swipeableCircle, animatedStylesSwipe]}></Animated.View>
//       </PanGestureHandler>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   containerStyle: {
//     backgroundColor: 'white',
//     height: BUTTON_HEIGHT,
//     width: BUTTON_WIDTH,
//     borderRadius: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   swipeableCircle: {
//     height: SWIPEABLE_DIMENSIONS,
//     width: SWIPEABLE_DIMENSIONS,
//     backgroundColor: 'red',
//     borderRadius: 100,
//     position: 'absolute',
//     zIndex: 3,
//     left: BUTTON_PADDING,
//   },
