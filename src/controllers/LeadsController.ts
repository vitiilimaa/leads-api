import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { Prisma } from "@prisma/client";

export class LeadsController {
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

      const pageNumber = +page;
      const pageSizeNumber = +pageSize;

      const where: Prisma.LeadWhereInput = {};
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const orderBy = { [sortBy]: order };
      const take = pageSizeNumber;
      const skip = (pageNumber - 1) * pageSizeNumber;

      const leads = await prisma.lead.findMany({
        include: { campaigns: true, groups: true },
        where,
        orderBy,
        take,
        skip,
      });

      const count = await prisma.lead.count();
      const totalPages = Math.ceil(count / pageSizeNumber);

      res.json({
        data: leads,
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

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const lead = await prisma.lead.create({ data: body });
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: +req.params.id },
        include: { campaigns: true, groups: true },
      });

      if (!lead) throw new HttpError(404, "Lead não encontrado!");

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const { groupId, ...body } = UpdateLeadRequestSchema.parse(req.body);

      const hasGroupId = groupId
        ? { groups: { connect: { id: groupId } } }
        : {};

      const leadExists = await prisma.lead.findUnique({
        where: { id },
      });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado!");

      const updatedLead = await prisma.lead.update({
        data: { ...body, ...hasGroupId },
        where: { id },
      });

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const leadExists = await prisma.lead.findUnique({
        where: { id },
      });
      if (!leadExists) throw new HttpError(404, "Lead não encontrado!");

      const deletedLead = await prisma.lead.delete({
        where: { id },
      });

      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
