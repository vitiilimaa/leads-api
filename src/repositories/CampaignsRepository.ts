import { Campaign } from "@prisma/client";

export type CampaignLeadStatus =
  | "New"
  | "Engaged"
  | "FollowUp_Scheduled"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Re_Engaged"
  | "Opted_Out";

export interface ICreateCampaignAttributes {
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IAddLeadToCampaignAttributes {
  campaignId: number;
  leadId: number;
  status: CampaignLeadStatus;
}

export interface ICampaignsRepository {
  findAll: () => Promise<Campaign[]>;
  findById: (id: number) => Promise<Campaign | null>;
  create: (attributes: ICreateCampaignAttributes) => Promise<Campaign>;
  updateById: (
    id: number,
    attributes: Partial<ICreateCampaignAttributes>
  ) => Promise<Campaign | null>;
  deleteById: (id: number) => Promise<Campaign | null>;
  addLead: (attributes: IAddLeadToCampaignAttributes) => Promise<void>;
  updateLeadStatus: (
    attributes: IAddLeadToCampaignAttributes
  ) => Promise<void>;
  removeLead: (campaignId: number, leadId: number) => Promise<void>;
}
