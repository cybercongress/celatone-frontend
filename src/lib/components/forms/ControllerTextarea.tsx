import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import type { TextAreaProps } from "./TextAreaInput";

interface ControllerTextareaProps<T extends FieldValues>
  extends Omit<TextAreaProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
}

export const ControllerTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  ...componentProps
}: ControllerTextareaProps<T>) => {
  const { field } = useController({ name, control });
  return (
    <FormControl
      className="textarea-form"
      size="md"
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          bgColor={labelBgColor}
          className={field.value.length !== 0 ? "floating" : ""}
        >
          {label}
        </FormLabel>
      )}
      <Textarea
        resize="none"
        placeholder={placeholder}
        _placeholder={{ color: "text.dark" }}
      />
      <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      {!error && (
        <FormHelperText className="helper-text">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
