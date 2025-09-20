import { Lead } from "@prisma/client";
import { CampaignLeadStatus } from "./CampaignsRepository";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Archived";

export interface ILeadWhereParams {
  name?: {
    like?: string;
    equals?: string;
    mode?: "default" | "insensitive";
  };
  status?: LeadStatus;
  groupId?: number
  campaignId?: number;
  campaignLeadStatus?: CampaignLeadStatus
}

export interface ILeadsFindAllParams {
  where?: ILeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
  include?: {
    groups?: boolean;
    campaigns?: boolean;
  }
}

export interface ICreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface ILeadsRepository {
  findAll: (params: ILeadsFindAllParams) => Promise<Lead[]>;
  findById: (id: number) => Promise<Lead | null>;
  count: (params: ILeadWhereParams) => Promise<number>;
  create: (attributes: ICreateLeadAttributes) => Promise<Lead>;
  updateById: (
    id: number,
    attributes: Partial<ICreateLeadAttributes>
  ) => Promise<Lead | null>;
  deleteById: (id: number) => Promise<Lead | null>;
}