import { Lead, Prisma } from "@prisma/client";
import { CampaignLeadStatus } from "./CampaignsRepository";
import { prisma } from "../database";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted"
  | "Unresponsive"
  | "Disqualified"
  | "Archived";

export interface ILeadWhereParams {
  name?: {
    like?: string;
    equals?: string;
    mode?: "default" | "insensitive";
  };
  status?: LeadStatus;
  groupId?: number;
  campaignId?: number;
  campaignLeadStatus?: CampaignLeadStatus;
}

export interface ILeadsFindAllParams {
  where?: ILeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
  include?: {
    groups?: boolean;
    campaigns?: boolean;
  };
}

export interface ICreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface ILeadsRepository {
  findAll: (params: ILeadsFindAllParams) => Promise<Lead[]>;
  findById: (id: number) => Promise<Lead | null>;
  count: (params: ILeadWhereParams) => Promise<number>;
  create: (attributes: ICreateLeadAttributes) => Promise<Lead>;
  updateById: (
    id: number,
    attributes: Partial<ICreateLeadAttributes>
  ) => Promise<Lead | null>;
  deleteById: (id: number) => Promise<Lead | null>;
}

export class LeadsRepository implements ILeadsRepository {
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

    return await prisma.lead.count({
      where,
    });
  }

  async create(attributes: ICreateLeadAttributes): Promise<Lead> {
    return await prisma.lead.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateLeadAttributes>
  ): Promise<Lead | null> {
    return await prisma.lead.update({ where: { id }, data: attributes });
  }

  async deleteById(id: number): Promise<Lead | null> {
    return await prisma.lead.delete({ where: { id } });
  }
}
