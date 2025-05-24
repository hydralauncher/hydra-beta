import { useState } from "react";
import { Typography } from "../typography/typography";
import { CaretUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export interface AccordionProps {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface AccordionHeaderProps {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface AccordionContentProps {
  children: React.ReactNode;
}

function AccordionHeader({
  title,
  hint,
  icon,
  isOpen,
  setIsOpen,
}: Readonly<AccordionHeaderProps>) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={clsx("accordion__header", {
        "accordion__header--open": isOpen,
      })}
    >
      <div className="accordion__header__label">
        {icon}
        <Typography variant="label">{title}</Typography>
      </div>

      <div className="accordion__header__indicators">
        {hint && <Typography variant="label">{hint}</Typography>}

        <motion.div
          animate={{ rotate: isOpen ? 0 : 180, y: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="accordion__header__indicators__icon"
        >
          <CaretUpIcon size={18} />
        </motion.div>
      </div>
    </button>
  );
}

function AccordionContent({ children }: Readonly<AccordionContentProps>) {
  return <div className="accordion__content">{children}</div>;
}

export function Accordion({
  title,
  hint,
  icon,
  children,
}: Readonly<AccordionProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <AccordionHeader
        title={title}
        hint={hint}
        icon={icon}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, scaleY: 0 }}
            exit={{ height: 0, scaleY: 0 }}
            animate={{ height: "auto", scaleY: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ originY: 0 }}
          >
            <AccordionContent>{children}</AccordionContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
