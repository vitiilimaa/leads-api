import { Campaign } from "@prisma/client";
import { prisma } from "../database";

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
  updateLeadStatus: (attributes: IAddLeadToCampaignAttributes) => Promise<void>;
  removeLead: (campaignId: number, leadId: number) => Promise<void>;
}

export class CampaignsRepository implements ICampaignsRepository {
  async findAll(): Promise<Campaign[]> {
    return await prisma.campaign.findMany();
  }

  async findById(id: number): Promise<Campaign | null> {
    return await prisma.campaign.findUnique({
      include: { leads: { include: { lead: true } } },
      where: { id },
    });
  }

  async count(): Promise<number> {
    return await prisma.campaign.count();
  }

  async create(attributes: ICreateCampaignAttributes): Promise<Campaign> {
    return await prisma.campaign.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateCampaignAttributes>
  ): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignExists) return null;
    return await prisma.campaign.update({ data: attributes, where: { id } });
  }

  async deleteById(id: number): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignExists) return null;
    return await prisma.campaign.delete({ where: { id } });
  }

  async addLead(attributes: IAddLeadToCampaignAttributes): Promise<void> {
    await prisma.campaignLead.create({
      data: attributes,
    });
  }

  async updateLeadStatus(
    attributes: IAddLeadToCampaignAttributes
  ): Promise<void> {
    const { campaignId, leadId, status } = attributes;

    await prisma.campaignLead.update({
      data: { status },
      where: { leadId_campaignId: { campaignId, leadId } },
    });
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.campaignLead.delete({
      where: { leadId_campaignId: { campaignId, leadId } },
    });
  }
}
