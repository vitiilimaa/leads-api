import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { ICampaignsRepository } from "../repositories/CampaignsRepository";
import {
  ILeadsRepository,
  ILeadWhereParams,
} from "../repositories/LeadsRepository";

export class CampaignLeadsController {
  private readonly campaignsRepository: ICampaignsRepository;
  private readonly leadsRepository: ILeadsRepository;

  constructor(
    campaignsRepository: ICampaignsRepository,
    leadsRepository: ILeadsRepository
  ) {
    this.campaignsRepository = campaignsRepository;
    this.leadsRepository = leadsRepository;
  }

  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        sortBy = "createdAt",
        order = "desc",
        name,
        status,
      } = query;

      const pageNumber = +page;
      const limit = +pageSize;
      const offset = (pageNumber - 1) * limit;

      const where: ILeadWhereParams = {
        campaignId,
        campaignLeadStatus: status,
      };
      if (name) where.name = { like: name, mode: "insensitive" };

      const result = await this.leadsRepository.findAll({
        where,
        limit,
        offset,
        order,
        sortBy,
        include: { campaigns: true },
      });

      const count = await this.leadsRepository.count(where);
      const totalPages = Math.ceil(count / limit);

      res.json({
        data: result,
        pagination: {
          page: pageNumber,
          pageSize: limit,
          count,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body);
      const campaignId = +req.params.campaignId;
      await this.campaignsRepository.addLead({ campaignId, leadId, status });
      res
        .status(201)
        .json({ message: "Lead adicionado na campanha com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);
      await this.campaignsRepository.updateLeadStatus({
        campaignId,
        leadId,
        status,
      });
      res.json({ message: "Status do lead atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      await this.campaignsRepository.removeLead(campaignId, leadId);
      res.json({ message: "Lead removido da campanha com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
