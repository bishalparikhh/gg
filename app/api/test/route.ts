import {auth0} from "../../../lib/auth0"
export async function fetchAccesstoken() {
  try {
    const session = await auth0.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    const { token: accessToken } = await auth0.getAccessToken();
    return { accessToken };
  } catch (error: any) {
    return { error: error.message, status: error.status || 500 };
  }
}