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
  private readonly genericErrorMessage =
    "Erro encontrado no repositório GroupsRepository:";

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
    try {
      return await prisma.group.update({
        where: { id },
        data: attributes,
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.log(this.genericErrorMessage, error.message);
      return null;
    }
  }

  async deleteById(id: number): Promise<Group | null> {
    try {
      return await prisma.group.delete({ where: { id } });
    } catch (err: unknown) {
      const error = err as Error;
      console.log(this.genericErrorMessage, error.message);
      return null;
    }
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
