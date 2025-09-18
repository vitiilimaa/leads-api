import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import {
  ILeadsRepository,
  ILeadWhereParams,
} from "../repositories/LeadsRepository";

export class LeadsController {
  private leadsRepository: ILeadsRepository;

  constructor(leadsRepository: ILeadsRepository) {
    this.leadsRepository = leadsRepository;
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

      const pageNumber = +page;
      const limit = +pageSize;
      const offset = (pageNumber - 1) * limit;

      const where: ILeadWhereParams = {};
      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await this.leadsRepository.findAll({
        where,
        limit,
        offset,
        order,
        sortBy,
      });

      const count = await this.leadsRepository.count(where);
      const totalPages = Math.ceil(count / limit);

      res.json({
        data: leads,
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

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const lead = await this.leadsRepository.create(body);
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const lead = await this.leadsRepository.findById(+req.params.id);

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

      const lead = await this.leadsRepository.findById(id);

      if (!lead) throw new HttpError(404, "Lead não encontrado");

      if (lead.status === "New" && body.status !== "Contacted")
        throw new HttpError(
          400,
          "O lead precisa ser contatado antes de ter seu status atualizado para outro valor."
        );

      if (body.status === "Archived") {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 180)
          throw new HttpError(
            400,
            "O lead só pode ser arquivado após 6 meses de inatividade."
          );
      }

      const data = {
        ...body,
        ...hasGroupId,
      };

      const updatedLead = await this.leadsRepository.updateById(id, data);

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const leadExists = await this.leadsRepository.findById(id);
      if (!leadExists) throw new HttpError(404, "Lead não encontrado!");

      const deletedLead = await this.leadsRepository.deleteById(id);

      res.json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
