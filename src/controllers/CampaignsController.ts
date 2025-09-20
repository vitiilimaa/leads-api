import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { ICampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignsController {
  private readonly campaignsRepository: ICampaignsRepository;

  constructor(campaignsRepository: ICampaignsRepository) {
    this.campaignsRepository = campaignsRepository;
  }

  getAll: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsRepository.findAll();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const campaign = await this.campaignsRepository.create(body);
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const campaign = await this.campaignsRepository.findById(+req.params.id);
      if (!campaign) throw new HttpError(404, "A campanha não existe!");
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  updateById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSchema.parse(req.body);
      const campaign = await this.campaignsRepository.updateById(id, body);
      if (!campaign) throw new HttpError(404, "A campanha não existe!");
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  deleteById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedCampaign = await this.campaignsRepository.deleteById(id);
      if (!deletedCampaign) throw new HttpError(404, "A campanha não existe!");
      res.json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
