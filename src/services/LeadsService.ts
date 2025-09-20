import { Lead } from "@prisma/client";
import {
  ICreateLeadAttributes,
  ILeadsRepository,
  ILeadWhereParams,
  LeadStatus,
} from "../repositories/LeadsRepository";
import { HttpError } from "../errors/HttpError";

export interface ILeadsFindAllParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
}

export class LeadsService {
  private readonly leadsRepository: ILeadsRepository;

  constructor(leadsRepository: ILeadsRepository) {
    this.leadsRepository = leadsRepository;
  }

  async findAll(params: ILeadsFindAllParams) {
    const { page = 1, pageSize = 10, sortBy, order, name, status } = params;
    const limit = pageSize;
    const offset = (page - 1) * limit;

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

    return {
      data: leads,
      pagination: {
        page,
        pageSize,
        count,
        totalPages,
      },
    };
  }

  async create(attributes: ICreateLeadAttributes): Promise<Lead> {
    const lead = await this.leadsRepository.create(attributes);
    return lead;
  }

  async findById(id: number): Promise<Lead | null> {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, "Lead não encontrado!");
    return lead;
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateLeadAttributes>
  ): Promise<Lead | null> {
    const lead = await this.leadsRepository.findById(id);

    if (!lead) throw new HttpError(404, "Lead não encontrado");

    if (lead.status === "New" && attributes.status !== "Contacted")
      throw new HttpError(
        400,
        "O lead precisa ser contatado antes de ter seu status atualizado para outro valor."
      );

    if (attributes.status === "Archived") {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 180)
        throw new HttpError(
          400,
          "O lead só pode ser arquivado após 6 meses de inatividade."
        );
    }

    const updatedLead = await this.leadsRepository.updateById(id, attributes);

    return updatedLead;
  }

  async deleteById(id: number): Promise<Lead | null> {
    const deletedLead = await this.leadsRepository.deleteById(id);
    if (!deletedLead) throw new HttpError(404, "Lead não encontrado!");
    return deletedLead;
  }
}
