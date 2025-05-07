import { useState, useCallback } from "react";

export function useLoginPopup() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = useCallback(() => {
    setIsLoginPopupOpen(true);
  }, []);

  const closeLoginPopup = useCallback(() => {
    setIsLoginPopupOpen(false);
  }, []);

  const handleClosePopup = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.target.closest(".popup-content")) {
      setIsLoginPopupOpen(false);
    }
  }, []);

  return {
    isLoginPopupOpen,
    openLoginPopup,
    closeLoginPopup,
    handleClosePopup,
  };
}