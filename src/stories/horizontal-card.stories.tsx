import { HorizontalCard } from "@/components/common/horizontal-card";
import { PlusCircle } from "@phosphor-icons/react";
import { Button } from "@/components/common";

export default {
  title: "Game Cards/Horizontal Card",
  component: HorizontalCard,
  parameters: {
    layout: "centered",
  },
};

export const Base = () => (
  <HorizontalCard
    image="https://cdn2.steamgriddb.com/thumb/a779abf92aeec12331d10524426171fb.jpg"
    title="Baldur's Gate 3"
    description="2 download sources"
    action={
      <Button variant="secondary" size="icon">
        <PlusCircle size={24} />
      </Button>
    }
  />
);
