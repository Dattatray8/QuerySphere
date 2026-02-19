import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from 'react-redux';
import { store } from "../redux/store";
import { SocketProvider } from "./context/SocketContext";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Stack 
          screenOptions={{ headerShown: false }}
          initialRouteName="(tabs)"
        />
        <Toast />
      </SocketProvider>
    </Provider>
  );
}
