import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type Ctx = {
  uri: string | null;
  setUri: (uri: string | null) => void;
  loading: boolean;
};

const ProfileImageContext = createContext<Ctx | null>(null);

export function ProfileImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUri = await AsyncStorage.getItem("profileImageUri");
        if (storedUri) setUri(storedUri);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (uri === null) {
        await AsyncStorage.removeItem("profileImageUri");
      } else {
        await AsyncStorage.setItem("profileImageUri", uri);
      }
    })();
  }, [uri]);

  return (
    <ProfileImageContext.Provider value={{ uri, setUri, loading }}>
      {children}
    </ProfileImageContext.Provider>
  );
}

export function useProfileImage() {
  const ctx = React.useContext(ProfileImageContext);
  if (!ctx)
    throw new Error(
      "useProfileImage must be used within a ProfileImageProvider"
    );
  return ctx;
}
