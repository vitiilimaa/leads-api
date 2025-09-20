import { Handler } from "express";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import {
  ILeadsRepository,
  ILeadWhereParams,
} from "../repositories/LeadsRepository";
import { IGroupsRepository } from "../repositories/GroupsRepository";

export class GroupLeadsController {
  private readonly groupsRepository: IGroupsRepository;
  private readonly leadsRepository: ILeadsRepository;

  constructor(
    groupsRepository: IGroupsRepository,
    leadsRepository: ILeadsRepository
  ) {
    this.groupsRepository = groupsRepository;
    this.leadsRepository = leadsRepository;
  }

  getLeads: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        sortBy = "createdAt",
        order,
        name,
        status,
      } = query;

      const pageNumber = +page;
      const limit = +pageSize;
      const offset = (pageNumber - 1) * limit;

      const where: ILeadWhereParams = {
        groupId: +req.params.groupId,
      };

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

      const result = await this.leadsRepository.findAll({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { groups: true },
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
      const body = AddLeadRequestSchema.parse(req.body);
      const groupId = +req.params.groupId;
      const leadId = body.leadId;

      const lead = await this.groupsRepository.addLead(groupId, leadId);

      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;

      const deletedLead = await this.groupsRepository.removeLead(
        groupId,
        leadId
      );

      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
