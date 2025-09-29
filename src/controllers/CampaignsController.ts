import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignsController {
  private readonly campaignsService: CampaignsService;

  constructor(campaignsService: CampaignsService) {
    this.campaignsService = campaignsService;
  }

  getAll: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.findAll();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const campaign = await this.campaignsService.create(body);
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const campaign = await this.campaignsService.findById(+req.params.id);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  updateById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSchema.parse(req.body);
      const campaign = await this.campaignsService.updateById(id, body);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  deleteById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedCampaign = await this.campaignsService.deleteById(id);
      res.json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
