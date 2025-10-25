import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { googleSignIn } from "../api/auth";

export class GoogleAuthService {
  static async configure() {
    GoogleSignin.configure({
      iosClientId:
        "173233017477-p9kg3199vq1gjplf0mka3h0c9mih1k7c.apps.googleusercontent.com",
      webClientId:
        "173233017477-7eumhmqp1tm0hlq7dch296dqfrh7e384.apps.googleusercontent.com",
      // Note: webClientId is used for both Android and web
      // Android OAuth client ID (173233017477-83v2s3jrl5jlgmhk5qrirl5o2mnktr1k) is configured in Google Console
    });
  }

  static async signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log("userInfo", userInfo);

      // Check if we received valid user info and ID token
      if (!userInfo.data?.user || !userInfo.data?.idToken) {
        return {
          success: false,
          error: "Failed to get user information from Google",
        };
      }

      // Send the ID token to your backend
      const response = await googleSignIn({
        token: userInfo.data.idToken,
      });

      return {
        success: true,
        user: userInfo.data.user,
        response: response.data,
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { success: false, error: "Sign-in was cancelled" };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return { success: false, error: "Sign-in is already in progress" };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { success: false, error: "Play Services not available" };
      } else {
        return {
          success: false,
          error: `${error.code}: ${error.message}` || "Unknown error occurred",
        };
      }
    }
  }

  static async signOut() {
    try {
      await GoogleSignin.signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Sign-out failed" };
    }
  }

  static async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return { success: true, user: userInfo.data?.user };
    } catch (error) {
      return { success: false, user: null };
    }
  }
}
