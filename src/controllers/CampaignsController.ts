import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./schemas/CampaignsRequestSchema";

export class CampaignsController {
  getAll: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        include: { leads: { include: { lead: true } } },
      });
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const campaign = await prisma.campaign.create({ data: body });
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        include: { leads: { include: { lead: true } } },
        where: { id: +req.params.id },
      });
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const { leadId, ...body } = UpdateCampaignRequestSchema.parse(req.body);

      const campaignExists = await prisma.campaign.findUnique({
        where: { id },
      });

      if (!campaignExists) throw new HttpError(404, "A campanha não existe!");

      const hasLeadId = leadId
        ? { leads: { create: { lead: { connect: { id: leadId } } } } }
        : {};

      const campaign = await prisma.campaign.update({
        data: {
          ...body,
          ...hasLeadId,
        },
        where: { id },
      });
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaignExists = await prisma.campaign.findUnique({
        where: { id },
      });

      if (!campaignExists) throw new HttpError(404, "A campanha não existe!");

      const deletedCampaign = await prisma.campaign.delete({ where: { id } });

      res.json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
