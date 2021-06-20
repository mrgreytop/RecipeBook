import MockAsyncStorage from "mock-async-storage";

const mockStoreImpl = new MockAsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockStoreImpl);

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');