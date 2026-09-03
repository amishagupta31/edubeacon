"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import SchoolRegistrationModal from "./SchoolRegistrationModal";
import VendorRegistrationModal from "./VendorRegistrationModal";
import InterestModal from "./InterestModal";
import AwardNominationModal from "./AwardNominationModal";

type ModalType =
  | "school-register"
  | "vendor-register"
  | "interest"
  | "award-nominate"
  | null;

interface ModalContextValue {
  openModal: (type: ModalType, meta?: Record<string, string>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  openModal: () => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [meta, setMeta] = useState<Record<string, string>>({});

  const openModal = useCallback(
    (type: ModalType, extraMeta?: Record<string, string>) => {
      setActiveModal(type);
      setMeta(extraMeta ?? {});
      document.body.style.overflow = "hidden";
    },
    []
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {activeModal === "school-register" && (
        <SchoolRegistrationModal onClose={closeModal} />
      )}
      {activeModal === "vendor-register" && (
        <VendorRegistrationModal onClose={closeModal} />
      )}
      {activeModal === "interest" && (
        <InterestModal onClose={closeModal} vendorName={meta.vendorName} />
      )}
      {activeModal === "award-nominate" && (
        <AwardNominationModal onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
}
