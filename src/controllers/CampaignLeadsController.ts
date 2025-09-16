import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./schemas/CampaignsRequestSchema";
import { prisma } from "../database";
import { Prisma } from "@prisma/client";

export class CampaignLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.id;
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
      const pageSizeNumber = +pageSize;

      const where: Prisma.LeadWhereInput = {
        campaigns: { some: { campaignId } },
      };
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.campaigns = { some: { status } };

      const orderBy = { [sortBy]: order };
      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;

      const result = await prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              status: true,
            },
          },
        },
      });

      const count = await prisma.lead.count({ where });
      const totalPages = Math.ceil(count / pageSizeNumber);

      res.json({
        data: result,
        pagination: {
          page: pageNumber,
          pageSize: pageSizeNumber,
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

      await prisma.campaignLead.create({
        data: { ...body, campaignId: +req.params.id },
      });

      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;

      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);

      const updatedCampaignLead = await prisma.campaignLead.update({
        data: { status },
        where: { leadId_campaignId: { campaignId, leadId } },
      });

      res.json(updatedCampaignLead);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;

      const deletedCampaignLead = await prisma.campaignLead.delete({
        where: { leadId_campaignId: { campaignId, leadId } },
      });

      res.json(deletedCampaignLead);
    } catch (error) {
      next(error);
    }
  };
}
