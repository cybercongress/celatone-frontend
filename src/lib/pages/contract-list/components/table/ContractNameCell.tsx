import { EditableCell } from "lib/components/table";
import { MAX_CONTRACT_NAME_LENGTH } from "lib/data";
import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractLocalInfo } from "lib/stores/contract";

interface ContractNameCellProps {
  contractLocalInfo: ContractLocalInfo;
  isReadOnly?: boolean;
}

export const ContractNameCell = ({
  contractLocalInfo,
  isReadOnly = false,
}: ContractNameCellProps) => {
  const onSave = useHandleContractSave({
    title: "Changed name successfully!",
    contractAddress: contractLocalInfo.contractAddress,
    instantiator: contractLocalInfo.instantiator,
    label: contractLocalInfo.label,
  });
  return (
    <EditableCell
      initialValue={contractLocalInfo.name}
      defaultValue={contractLocalInfo.label}
      maxLength={MAX_CONTRACT_NAME_LENGTH}
      tooltip={contractLocalInfo.description}
      onSave={!isReadOnly ? onSave : undefined}
    />
  );
};
