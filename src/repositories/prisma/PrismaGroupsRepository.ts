import { Group } from "@prisma/client";
import { ICreateGroupAttributes, IGroupsRepository } from "../GroupsRepository";
import { prisma } from "../../database";

export class PrismaGroupsRepository implements IGroupsRepository {
  async findAll(): Promise<Group[]> {
    return prisma.group.findMany();
  }

  async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({
      where: { id },
      include: { leads: true },
    });
  }

  async create(attributes: ICreateGroupAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes });
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateGroupAttributes>
  ): Promise<Group | null> {
    const groupExists = await prisma.group.findUnique({ where: { id } });
    if (!groupExists) return null;
    return prisma.group.update({
      where: { id },
      data: attributes,
    });
  }

  async deleteById(id: number): Promise<Group | null> {
    const groupExists = await prisma.group.findUnique({ where: { id } });
    if (!groupExists) return null;
    return prisma.group.delete({ where: { id } });
  }

  async addLead(groupId: number, leadId: number): Promise<Group | null> {
    return prisma.group.update({
      data: { leads: { connect: { id: leadId } } },
      where: { id: groupId },
      include: { leads: true },
    });
  }

  async removeLead(groupId: number, leadId: number): Promise<Group | null> {
    return prisma.group.update({
      data: { leads: { disconnect: { id: leadId } } },
      where: { id: groupId },
      include: { leads: true },
    });
  }
}
