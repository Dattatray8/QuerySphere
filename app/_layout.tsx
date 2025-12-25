import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from "../redux/store"

export default function RootLayout() {
  const isLogin = false;
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" />
      </Stack>
    </Provider>
  );
}
