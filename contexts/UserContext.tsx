import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  username: string;
  setUsername: (name: string) => void;
  profileImageUri: string | null;
  setProfileImageUri: (uri: string | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  signedUpOpportunityIds: string[];
  signUpForOpportunity: (opportunityId: string) => Promise<void>;
  leaveOpportunity: (opportunityId: string) => Promise<void>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERNAME_KEY = "userName";
const PROFILE_IMAGE_KEY = "profileImageUri";
const IS_ADMIN_KEY = "isAdmin";
const SIGNED_UP_OPPORTUNITIES_KEY = "signedUpOpportunities";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState<string>("User");
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(
    null
  );
  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [signedUpOpportunityIds, setSignedUpOpportunityIds] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [savedUsername, savedImageUri, savedIsAdmin, savedOpportunities] =
          await Promise.all([
            AsyncStorage.getItem(USERNAME_KEY),
            AsyncStorage.getItem(PROFILE_IMAGE_KEY),
            AsyncStorage.getItem(IS_ADMIN_KEY),
            AsyncStorage.getItem(SIGNED_UP_OPPORTUNITIES_KEY),
          ]);

        if (savedUsername) setUsernameState(savedUsername);
        if (savedImageUri) setProfileImageUriState(savedImageUri);
        if (savedIsAdmin !== null) setIsAdminState(savedIsAdmin === "true");
        if (savedOpportunities) {
          setSignedUpOpportunityIds(JSON.parse(savedOpportunities));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // Save username when it changes
  const setUsername = async (name: string) => {
    try {
      await AsyncStorage.setItem(USERNAME_KEY, name);
      setUsernameState(name);
    } catch (error) {
      console.error("Error saving username:", error);
    }
  };

  // Save profile image URI when it changes
  const setProfileImageUri = async (uri: string | null) => {
    try {
      if (uri === null) {
        await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
      } else {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
      }
      setProfileImageUriState(uri);
    } catch (error) {
      console.error("Error saving profile image:", error);
    }
  };

  // Save admin status when it changes
  const setIsAdmin = async (admin: boolean) => {
    try {
      await AsyncStorage.setItem(IS_ADMIN_KEY, admin.toString());
      setIsAdminState(admin);
    } catch (error) {
      console.error("Error saving admin status:", error);
    }
  };

  // Sign up for an opportunity
  const signUpForOpportunity = async (opportunityId: string) => {
    try {
      if (!signedUpOpportunityIds.includes(opportunityId)) {
        const updatedIds = [...signedUpOpportunityIds, opportunityId];
        await AsyncStorage.setItem(
          SIGNED_UP_OPPORTUNITIES_KEY,
          JSON.stringify(updatedIds)
        );
        setSignedUpOpportunityIds(updatedIds);
      }
    } catch (error) {
      console.error("Error signing up for opportunity:", error);
    }
  };

  // Leave an opportunity
  const leaveOpportunity = async (opportunityId: string) => {
    try {
      const updatedIds = signedUpOpportunityIds.filter(
        (id) => id !== opportunityId
      );
      await AsyncStorage.setItem(
        SIGNED_UP_OPPORTUNITIES_KEY,
        JSON.stringify(updatedIds)
      );
      setSignedUpOpportunityIds(updatedIds);
    } catch (error) {
      console.error("Error leaving opportunity:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        profileImageUri,
        setProfileImageUri,
        isAdmin,
        setIsAdmin,
        signedUpOpportunityIds,
        signUpForOpportunity,
        leaveOpportunity,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
