import { Campaign } from "@prisma/client";
import {
  IAddLeadToCampaignAttributes,
  ICampaignsRepository,
  ICreateCampaignAttributes,
} from "../repositories/CampaignsRepository";
import { HttpError } from "../errors/HttpError";

export class CampaignsService {
  private readonly campaignRepository: ICampaignsRepository;
  private readonly campaignNotFoundMessage = "Campanha não encontrada.";

  constructor(campaignRepository: ICampaignsRepository) {
    this.campaignRepository = campaignRepository;
  }

  async findAll() {
    return await this.campaignRepository.findAll();
  }

  async create(attributes: ICreateCampaignAttributes): Promise<Campaign> {
    return await this.campaignRepository.create(attributes);
  }

  async findById(id: number): Promise<Campaign | null> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) throw new HttpError(404, this.campaignNotFoundMessage);
    return campaign;
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateCampaignAttributes>
  ): Promise<Campaign | null> {
    const updatedCampaign = await this.campaignRepository.updateById(
      id,
      attributes
    );
    if (!updatedCampaign)
      throw new HttpError(404, this.campaignNotFoundMessage);
    return updatedCampaign;
  }

  async deleteById(id: number): Promise<{ deletedCampaign: Campaign } | null> {
    const deletedCampaign = await this.campaignRepository.deleteById(id);
    if (!deletedCampaign)
      throw new HttpError(404, this.campaignNotFoundMessage);
    return { deletedCampaign };
  }

  async addLead(attributes: IAddLeadToCampaignAttributes): Promise<void> {
    return await this.campaignRepository.addLead(attributes);
  }

  async updateLeadStatus(
    attributes: IAddLeadToCampaignAttributes
  ): Promise<void> {
    return await this.campaignRepository.updateLeadStatus(attributes);
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    return await this.campaignRepository.removeLead(campaignId, leadId);
  }
}
