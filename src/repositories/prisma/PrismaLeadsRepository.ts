import { Lead } from "@prisma/client";
import {
  ICreateLeadAttributes,
  ILeadsFindAllParams,
  ILeadsRepository,
  ILeadWhereParams,
} from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements ILeadsRepository {
  async findAll(params: ILeadsFindAllParams): Promise<Lead[]> {
    const { where, limit, offset, order, sortBy = "createdAt" } = params;

    const orderBy = { [sortBy]: order };

    const leads = await prisma.lead.findMany({
      include: { campaigns: true, groups: true },
      where,
      orderBy,
      take: limit,
      skip: offset,
    });

    return leads;
  }

  async findById(id: number): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
      include: { campaigns: true, groups: true },
    });
  }

  async count(params: ILeadWhereParams): Promise<number> {
    return prisma.lead.count({ where: params });
  }

  async create(attributes: ICreateLeadAttributes): Promise<Lead> {
    return prisma.lead.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateLeadAttributes>
  ): Promise<Lead | null> {
    return prisma.lead.update({ where: { id }, data: attributes });
  }

  async deleteById(id: number): Promise<Lead | null> {
    return prisma.lead.delete({ where: { id } });
  }
}
