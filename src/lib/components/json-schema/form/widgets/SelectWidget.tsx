/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@chakra-ui/react";
import type {
  EnumOptionsType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";
import {
  descriptionId,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  getTemplate,
} from "@rjsf/utils";
import type { OptionsOrGroups } from "chakra-react-select";
import { Select } from "chakra-react-select";
import type React from "react";

/**
 * chakra-react-select option base.
 */
interface OptionBase {
  variant?: string;
  colorScheme?: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface SelectOptionBase<T = unknown> extends OptionBase {
  label: string;
  value: T;
}

/**
 * Custom select for use with the react-jsonschema-form.
 * We do not create custom options because the entire library depends on the value being a number.
 * @param props
 * @todo Multi select
 */
const SelectWidget = <
  T,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: WidgetProps<T, S, F>
) => {
  const {
    schema,
    id,
    options,
    placeholder = "",
    multiple,
    required,
    disabled,
    readonly,
    value,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    // rawErrors = [],
    registry,
  } = props;
  const { enumOptions, enumDisabled, emptyValue } = options;

  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options);

  const handleOnMultiChange = (e: any) =>
    onChange(
      enumOptionsValueForIndex<S>(
        e.map((v: { value: any }) => {
          return v.value;
        }),
        enumOptions,
        emptyValue
      )
    );

  const handleOnChange = (e: any) =>
    onChange(enumOptionsValueForIndex<S>(e.value, enumOptions, emptyValue));

  const handleOnBlur = ({ target }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(
      id,
      enumOptionsValueForIndex<S>(target.value, enumOptions, emptyValue)
    );

  const handleOnFocus = ({ target }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(
      id,
      enumOptionsValueForIndex<S>(target.value, enumOptions, emptyValue)
    );

  const valueLabelMap: any = {};
  const displayEnumOptions: OptionsOrGroups<any, any> = Array.isArray(
    enumOptions
  )
    ? enumOptions.map((option: EnumOptionsType<S>, index: number) => {
        const { value: optionValue, label: optionLabel } = option;
        valueLabelMap[index] = optionLabel || String(optionValue);
        return {
          label: optionLabel,
          value: String(index),
          isDisabled:
            Array.isArray(enumDisabled) &&
            enumDisabled.indexOf(optionValue) !== -1,
        };
      })
    : [];

  const isMultiple =
    typeof multiple !== "undefined" &&
    multiple !== false &&
    Boolean(enumOptions);
  const selectedIndex = enumOptionsIndexForValue<S>(
    value,
    enumOptions,
    isMultiple
  );
  const formValue: any = isMultiple
    ? ((selectedIndex as string[]) || []).map((i: string) => {
        return {
          label: valueLabelMap[i],
          value: i,
        };
      })
    : {
        label: valueLabelMap[selectedIndex as string] || "",
        selectedIndex,
      };

  return (
    <FormControl
      my={2}
      isDisabled={disabled || readonly}
      isRequired={required && !readonly}
      isReadOnly={readonly}
      // isInvalid={rawErrors && rawErrors.length > 0}
      sx={{ "& > p": { mt: 4, mb: 2 } }}
    >
      {!!schema.description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(id)}
          description={schema.description}
          schema={schema}
          registry={registry}
        />
      )}
      <Select
        inputId={id}
        name={id}
        isMulti={isMultiple}
        options={displayEnumOptions}
        placeholder={
          placeholder.length > 0 || readonly ? placeholder : "Select option"
        }
        closeMenuOnSelect={!isMultiple}
        onBlur={handleOnBlur}
        onChange={isMultiple ? handleOnMultiChange : handleOnChange}
        onFocus={handleOnFocus}
        autoFocus={autofocus}
        value={selectedIndex === undefined ? undefined : formValue}
        menuPosition="fixed"
        menuPortalTarget={document.querySelector("body")}
        chakraStyles={{
          control: (provided) => ({
            ...provided,
            _disabled: {
              color: "text.main",
            },
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isDisabled ? "gray.700" : undefined,
          }),
          option: (provided) => ({
            ...provided,
            color: "text.main",
            _hover: {
              bg: "gray.700",
            },
            _selected: {
              bg: "gray.800",
            },
          }),
        }}
      />
    </FormControl>
  );
};

export default SelectWidget;
