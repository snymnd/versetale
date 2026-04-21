import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ViewProps } from 'react-native';

interface SafeAreaWrapperProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Wraps children with safe area padding applied via insets.
 * Uses explicit inset values so NativeWind className stays composable.
 */
export function SafeAreaWrapper({ children, style, ...props }: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
