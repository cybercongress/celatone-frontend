import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useController, useWatch } from "react-hook-form";

import type { FormStatus } from "./FormStatus";
import { getResponseMsg, getStatusIcon } from "./FormStatus";
import type { TextInputProps } from "./TextInput";

export interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps["rules"];
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
  cta?: {
    label: string;
    onClick: (changeValue?: (...event: string[]) => void) => void;
  };
}

export const ControllerInput = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  size = "lg",
  type = "text",
  rules = {},
  status,
  maxLength,
  autoFocus,
  cursor,
  helperAction,
  cta,
  ...componentProps
}: ControllerInputProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });

  const {
    field,
    fieldState: { isTouched },
  } = useController<T>({
    name,
    control,
    rules,
  });

  const isError = isTouched && !!error;
  const isRequired = "required" in rules;
  const inputPaddingRight = () => {
    if (status) {
      return "2rem";
    }

    if (cta) {
      return "3rem";
    }

    return 0;
  };

  return (
    <FormControl
      size={size}
      isInvalid={isError || status?.state === "error"}
      isRequired={isRequired}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          className={`${size}-label`}
          bgColor={labelBgColor}
          requiredIndicator={
            <Text as="span" color="error.main" pl={1}>
              * (Required)
            </Text>
          }
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          size={size}
          placeholder={placeholder}
          type={type}
          value={watcher}
          onChange={field.onChange}
          maxLength={maxLength}
          autoFocus={autoFocus}
          cursor={cursor}
          pr={inputPaddingRight()}
        />
        <InputRightElement h="full" pr={cta ? 3 : 0}>
          {status && getStatusIcon(status.state)}
          {cta && !error && (
            <Text
              bg="background.main"
              variant="body2"
              color="accent.main"
              onClick={() => cta.onClick(field.onChange)}
              cursor="pointer"
            >
              {cta.label}
            </Text>
          )}
        </InputRightElement>
      </InputGroup>
      <Flex gap={1} alignItems="center" mt={1} justifyContent="space-between">
        {isError ? (
          <FormErrorMessage className="error-text">{error}</FormErrorMessage>
        ) : (
          <FormHelperText className="helper-text">
            {status?.message ? getResponseMsg(status, helperText) : helperText}
          </FormHelperText>
        )}
        {helperAction}
      </Flex>
    </FormControl>
  );
};
