import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { LeadsService } from "../services/LeadsService";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignLeadsController {
  private readonly campaignsService: CampaignsService;
  private readonly leadsService: LeadsService;

  constructor(campaignsService: CampaignsService, leadsService: LeadsService) {
    this.campaignsService = campaignsService;
    this.leadsService = leadsService;
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

      const result = await this.leadsService.findAll({
        page: +page,
        pageSize: +pageSize,
        sortBy,
        order,
        campaignId,
        campaignLeadStatus: status,
        name,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body);
      const campaignId = +req.params.campaignId;
      await this.campaignsService.addLead({ campaignId, leadId, status });
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
      await this.campaignsService.updateLeadStatus({
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
      await this.campaignsService.removeLead(campaignId, leadId);
      res.json({ message: "Lead removido da campanha com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
