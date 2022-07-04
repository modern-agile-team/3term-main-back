import { OperationType } from './operation.swagger';

export const operationConfig = (summary: string, description: string) => {
  const operation: OperationType = {
    summary,
    description,
  };

  return operation;
};
