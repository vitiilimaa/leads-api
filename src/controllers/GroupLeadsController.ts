import { Handler } from "express";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { GroupsService } from "../services/GroupsService";
import { LeadsService } from "../services/LeadsService";

export class GroupLeadsController {
  private readonly groupsService: GroupsService;
  private readonly leadsService: LeadsService;

  constructor(groupsService: GroupsService, leadsService: LeadsService) {
    this.groupsService = groupsService;
    this.leadsService = leadsService;
  }

  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        sortBy = "createdAt",
        order,
        name,
        status,
      } = query;

      const result = await this.leadsService.findAll({
        page: +page,
        pageSize: +pageSize,
        sortBy,
        order,
        groupId,
        name,
        status,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const body = AddLeadRequestSchema.parse(req.body);
      const groupId = +req.params.groupId;
      const leadId = body.leadId;

      await this.groupsService.addLead(groupId, leadId);

      res
        .status(201)
        .json({ message: "Lead adicionado no grupo com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;

      await this.groupsService.removeLead(groupId, leadId);

      res.json({ message: "Lead removido do grupo com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
