import { Handler } from "express";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { LeadsService } from "../services/LeadsService";

export class LeadsController {
  private readonly leadsService: LeadsService;

  constructor(leadsService: LeadsService) {
    this.leadsService = leadsService;
  }

  getAll: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
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
        name,
        status,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const lead = await this.leadsService.create(body);
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const lead = await this.leadsService.findById(+req.params.id);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  updateById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateLeadRequestSchema.parse(req.body);
      const updatedLead = await this.leadsService.updateById(id, body);
      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  deleteById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedLead = await this.leadsService.deleteById(id);
      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
