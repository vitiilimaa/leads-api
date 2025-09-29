import { Group } from "@prisma/client";
import { prisma } from "../database";

export interface ICreateGroupAttributes {
  name: string;
  description: string;
}

export interface IGroupsRepository {
  findAll: () => Promise<Group[]>;
  findById: (id: number) => Promise<Group | null>;
  create: (attributes: ICreateGroupAttributes) => Promise<Group>;
  updateById: (
    id: number,
    attributes: Partial<ICreateGroupAttributes>
  ) => Promise<Group | null>;
  deleteById: (id: number) => Promise<Group | null>;
  addLead: (groupId: number, leadId: number) => Promise<Group | null>;
  removeLead: (groupId: number, leadId: number) => Promise<Group | null>;
}

export class GroupsRepository implements IGroupsRepository {
  async findAll(): Promise<Group[]> {
    return await prisma.group.findMany();
  }

  async findById(id: number): Promise<Group | null> {
    return await prisma.group.findUnique({
      where: { id },
      include: { leads: true },
    });
  }

  async create(attributes: ICreateGroupAttributes): Promise<Group> {
    return await prisma.group.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateGroupAttributes>
  ): Promise<Group | null> {
    const groupExists = await prisma.group.findUnique({ where: { id } });
    if (!groupExists) return null;
    return await prisma.group.update({
      where: { id },
      data: attributes,
    });
  }

  async deleteById(id: number): Promise<Group | null> {
    const groupExists = await prisma.group.findUnique({ where: { id } });
    if (!groupExists) return null;
    return await prisma.group.delete({ where: { id } });
  }

  async addLead(groupId: number, leadId: number): Promise<Group | null> {
    return await prisma.group.update({
      data: { leads: { connect: { id: leadId } } },
      where: { id: groupId },
      include: { leads: true },
    });
  }

  async removeLead(groupId: number, leadId: number): Promise<Group | null> {
    return await prisma.group.update({
      data: { leads: { disconnect: { id: leadId } } },
      where: { id: groupId },
      include: { leads: true },
    });
  }
}
