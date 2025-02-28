import { Divider, type DividerProps } from "@/components";

export default {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { 
      control: "color"
    },
    orientation: { 
      control: "select", 
      options: ["horizontal", "vertical"]
    },
  },
};

export const Base = (args: DividerProps) => (
  <div style={{ width: "250px", height: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
    <Divider color="#FFFFFF" {...args} />
  </div>
);

export const Orientation = (args: DividerProps) => (
  <div style={{ 
    width: "300px", 
    height: "150px", 
    display: "flex",
    alignItems: "center",  
    justifyContent: "center",
    padding: "1rem"
  }}>
    <div style={{ 
      height: "100%",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "1rem"
    }}>
      <p style={{ textAlign: "center" }}>Vertical</p>
    </div>
    <Divider orientation="vertical" color="#FFFFFF" {...args} />
    <div style={{  
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      textAlign: "left",
      padding: "1rem"
    }}>
      <p style={{ width: "100px" }}>Horizontal</p>
      <Divider orientation="horizontal" color="#FFFFFF" {...args} />
      <p style={{ width: "100px" }}>Horizontal</p>
    </div>
  </div>
);
