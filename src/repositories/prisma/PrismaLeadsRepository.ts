import { Lead, Prisma } from "@prisma/client";
import {
  ICreateLeadAttributes,
  ILeadsFindAllParams,
  ILeadsRepository,
  ILeadWhereParams,
} from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements ILeadsRepository {
  async findAll(params: ILeadsFindAllParams): Promise<Lead[]> {
    const {
      where,
      limit,
      offset,
      order,
      sortBy = "createdAt",
      include,
    } = params;

    const orderBy = { [sortBy]: order };

    let prismaWhere: Prisma.LeadWhereInput = {
      name: {
        contains: where?.name?.like,
        equals: where?.name?.equals,
        mode: where?.name?.mode,
      },
      status: where?.status,
    };

    if (where?.groupId) {
      prismaWhere.groups = {
        some: {
          id: where.groupId,
        },
      };
    }

    if (where?.campaignId) {
      prismaWhere.campaigns = {
        some: {
          campaignId: where.campaignId,
          status: where?.campaignLeadStatus,
        },
      };
    }

    const leads = await prisma.lead.findMany({
      where: prismaWhere,
      orderBy,
      take: limit,
      skip: offset,
      include,
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
    let where: Prisma.LeadWhereInput = {
      name: {
        contains: params?.name?.like,
        equals: params?.name?.equals,
        mode: params?.name?.mode,
      },
      status: params?.status,
    };

    if (params?.groupId) {
      where.groups = {
        some: {
          id: params.groupId,
        },
      };
    }

    if (params?.campaignId) {
      where.campaigns = {
        some: {
          campaignId: params.campaignId,
          status: params?.campaignLeadStatus,
        },
      };
    }

    return prisma.lead.count({
      where,
    });
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
