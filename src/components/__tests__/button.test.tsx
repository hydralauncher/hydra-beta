import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button, type ButtonProps } from "@/components/common";

// Mock the Spinner component
vi.mock("@phosphor-icons/react", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

describe("Button", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("button", "button--primary", "button--medium");
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });

  describe("variants", () => {
    it.each([
      ["primary", "button--primary"],
      ["secondary", "button--secondary"],
      ["danger", "button--danger"],
      ["link", "button--link"],
      ["rounded", "button--rounded"],
    ] as [ButtonProps["variant"], string][])(
      "renders %s variant correctly",
      (variant, expectedClass) => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole("button")).toHaveClass(expectedClass);
      }
    );
  });

  describe("sizes", () => {
    it.each([
      ["small", "button--small"],
      ["medium", "button--medium"],
      ["large", "button--large"],
      ["icon", "button--icon"],
    ] as [ButtonProps["size"], string][])(
      "renders %s size correctly",
      (size, expectedClass) => {
        render(<Button size={size}>{size}</Button>);
        expect(screen.getByRole("button")).toHaveClass(expectedClass);
      }
    );
  });

  describe("states", () => {
    it("handles loading state", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("handles disabled state", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("button--disabled");
    });

    it("shows loading spinner regardless of children type", () => {
      render(
        <Button loading>
          <span>Loading</span>
        </Button>
      );
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  describe("icons", () => {
    it("renders button with icon", () => {
      const icon = <span data-testid="test-icon">🔍</span>;
      render(<Button icon={icon}>With Icon</Button>);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders button with icon on the right", () => {
      const icon = <span data-testid="test-icon">🔍</span>;
      render(
        <Button icon={icon} iconPosition="right">
          With Icon
        </Button>
      );
      const iconContainer = screen.getByTestId("test-icon").parentElement;
      expect(iconContainer).toHaveClass("button__icon-container--right");
    });
  });

  describe("link behavior", () => {
    it("renders as a link when href is provided", () => {
      render(<Button href="/test">Link Button</Button>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveClass("button", "button--primary");
    });

    it("renders as a link with target attribute", () => {
      render(
        <Button href="/test" target="_blank">
          Link Button
        </Button>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  describe("interactions", () => {
    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not trigger click when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not trigger click when loading", () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
