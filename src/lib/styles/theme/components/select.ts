import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Select: ComponentStyleConfig = {
  variants: {
    "custom-select": {
      field: {
        color: "text.main",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "pebble.700",
        fontSize: "16px",
        letterSpacing: "0.15px",
        height: "56px",
        bg: "background.main",
        _focus: {
          borderWidth: "2px",
          borderColor: "lilac.main",
        },
        _active: {
          borderWidth: "2px",
          borderColor: "lilac.main",
        },
      },
      icon: {
        color: "text.dark",
        fontSize: "24px",
      },
    },
  },
  defaultProps: {
    variant: "custom-select",
  },
};
