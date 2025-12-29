import { serverUrl } from "@/config/config";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

