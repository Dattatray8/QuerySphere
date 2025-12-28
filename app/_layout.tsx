import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from "../redux/store"
import Toast from "react-native-toast-message";

export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" />
      </Stack>
      <Toast />
    </Provider>
  );
}
