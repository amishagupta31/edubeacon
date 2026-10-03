"use client";

import { useModal } from "./modals/ModalProvider";

export default function MobileStickyCta() {
  const { openModal } = useModal();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-line bg-white/95 backdrop-blur-sm px-4 py-3 flex gap-2 shadow-lg">
      <button
        onClick={() => openModal("school-register")}
        className="flex-1 bg-edu-blue text-white py-3 rounded-xl font-bold text-[13px] hover:bg-edu-blue-mid transition-colors"
      >
        Register School
      </button>
      <button
        onClick={() => openModal("vendor-register")}
        className="flex-1 border-2 border-teal text-teal py-3 rounded-xl font-bold text-[13px] hover:bg-teal hover:text-white transition-colors"
      >
        Become a Partner
      </button>
    </div>
  );
}
