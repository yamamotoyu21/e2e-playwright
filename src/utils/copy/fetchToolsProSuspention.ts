export interface SuspensionConfig {
  /**
   * Pro's profile id
   */
  profileId: string;
  /**
   * whether to suspend or unsuspend the pro
   */
  suspend: boolean;
  /**
   * admin token
   */
  token: string;
  /**
   * custom user agent to access staging
   */
  userAgent: string;
  /**
   * domain of Tools
   */
  toolsDomain: string;
}

/**
 * Suspends or recovers a profile using the Tools API.
 * @param config - The configuration object for the suspension operation.
 * @returns A Promise that resolves to the API response or undefined.
 * @throws If the profile status update fails.
 */
export const fetchToolsProSuspension = async (
  config: SuspensionConfig
): Promise<any | undefined> => {
  const { profileId, suspend, token, userAgent, toolsDomain } = config;

  const currentEpoch = Date.now();
  const requestURL = `${toolsDomain}/api/admin/profiles/${profileId}?_=${currentEpoch}`;

  const requestBody = {
    id: profileId,
    suspend: suspend ? ["admin"] : "recover",
  };

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": userAgent.toString(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(requestURL, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      console.log(
        `Tools Pro ${suspend ? "suspended" : "recovered"} successfully`
      );
    }
  } catch (error) {
    console.error("Error in fetchToolsProSuspension:", error);
  }
};
