type ProjectCommonOptional = {
  name?: string;
  description?: string;
  imageUrl?: string;
  contractTypeId?: number;
  contractSignedOnEpochSec?: number;
  budget?: number;
  isActive?: boolean;
};

type ProjectCommonRequired = {
  name: string;
  description: string;
  imageUrl: string;
  budget: number;
  isActive: boolean;
};

type ProjectId = {
  id: number;
};

export type ProjectUpdate = ProjectCommonOptional & ProjectId;
export type ProjectInsert = ProjectCommonOptional & ProjectCommonRequired;
export type Project = ProjectInsert & ProjectId;
