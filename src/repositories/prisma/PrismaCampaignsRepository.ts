import { Campaign, CampaignLead } from "@prisma/client";
import {
  CampaignLeadStatus,
  IAddLeadToCampaignAttributes,
  ICampaignsRepository,
  ICreateCampaignAttributes,
} from "../CampaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignsRepository implements ICampaignsRepository {
  async findAll(): Promise<Campaign[]> {
    return prisma.campaign.findMany();
  }

  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      include: { leads: { include: { lead: true } } },
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.campaign.count();
  }

  async create(attributes: ICreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateCampaignAttributes>
  ): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignExists) return null;
    return prisma.campaign.update({ data: attributes, where: { id } });
  }

  async deleteById(id: number): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } });
    if (!campaignExists) return null;
    return prisma.campaign.delete({ where: { id } });
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
