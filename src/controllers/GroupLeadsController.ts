import { Handler } from "express";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";

export class GroupLeadsController {
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
      const pageSizeNumber = +pageSize;

      const where: Prisma.LeadWhereInput = {
        groups: { some: { id: +req.params.id } },
      };

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const orderBy = { [sortBy]: order };
      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;

      const result = await prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { groups: true },
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

      const lead = await prisma.group.update({
        data: { leads: { connect: { id: body.leadId } } },
        where: { id: +req.params.id },
        include: { leads: true },
      });

      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const deletedLead = await prisma.group.update({
        data: { leads: { disconnect: { id: +req.params.leadId } } },
        where: { id: +req.params.groupId },
        include: { leads: true },
      });

      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
