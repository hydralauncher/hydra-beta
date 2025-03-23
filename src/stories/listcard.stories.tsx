import { Button, ListCard } from "@/components/common";
import { PlusCircle } from "@phosphor-icons/react";

export default {
  title: "Game Cards/List Card",
  component: ListCard,
  parameters: {
    layout: "centered",
  },
};

export const base = () => (
  <div style={{ width: "1000px" }}>
    <ListCard
      href="/"
      title="Baldur's Gate 3"
      description="Turn-Based, RPG, Adventure"
      image="https://cdn2.steamgriddb.com/thumb/a779abf92aeec12331d10524426171fb.jpg"
      action={
        <Button variant="secondary" icon={<PlusCircle size={24} />}>
          Add to Library
        </Button>
      }
      sources={["FitGirl", "SteamRip", "DODI", "kaOsKrew"]}
    />
  </div>
);
