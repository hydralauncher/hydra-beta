import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Backdrop } from "./backdrop";
import { IS_BROWSER } from "@/constants";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  clickOutsideToClose?: boolean;
}

export function Modal({
  visible,
  onClose,
  children,
  clickOutsideToClose = true,
}: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const isTopMostModal = () => {
    if (
      document.querySelector(
        ".featurebase-widget-overlay.featurebase-display-block"
      )
    )
      return false;

    const openModals = document.querySelectorAll("[role=dialog]");
    return (
      openModals.length &&
      openModals[openModals.length - 1] === modalContentRef.current
    );
  };

  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTopMostModal()) {
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, handleCloseClick]);

  useEffect(() => {
    if (!clickOutsideToClose || !visible) return;

    const onMouseDown = (e: MouseEvent) => {
      if (!isTopMostModal()) return;
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(e.target as Node)
      ) {
        handleCloseClick();
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [clickOutsideToClose, visible, handleCloseClick]);

  if (!IS_BROWSER) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <Backdrop>
          <motion.aside
            role="dialog"
            ref={modalContentRef}
            data-hydra-dialog
            className="modal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
          >
            {children}
          </motion.aside>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body
  );
}
