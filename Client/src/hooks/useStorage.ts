import { useContext } from "react";
import { StorageContext } from "../Contexts/StorageContext";

export function useStorage() {
  const context = useContext(StorageContext);

  if (context === undefined) {
    throw new Error("useStorage must be used within StorageProvider");
  }

  return context;
}
