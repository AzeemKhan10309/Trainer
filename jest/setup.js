/* eslint-env jest */
/* eslint-disable no-undef */

// Mock react-native gesture handler
import 'react-native-gesture-handler/jestSetup';

// Silence warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));