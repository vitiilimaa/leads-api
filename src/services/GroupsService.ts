import { Group } from "@prisma/client";
import {
  ICreateGroupAttributes,
  IGroupsRepository,
} from "../repositories/GroupsRepository";
import { HttpError } from "../errors/HttpError";

export class GroupsService {
  private readonly groupsRepository: IGroupsRepository;
  private readonly groupNotFoundMessage = "Grupo não encontrado.";

  constructor(groupsRepository: IGroupsRepository) {
    this.groupsRepository = groupsRepository;
  }

  async findAll() {
    return await this.groupsRepository.findAll();
  }

  async create(attributes: ICreateGroupAttributes): Promise<Group> {
    return await this.groupsRepository.create(attributes);
  }

  async findById(id: number): Promise<Group | null> {
    const group = await this.groupsRepository.findById(id);
    if (!group) throw new HttpError(404, this.groupNotFoundMessage);
    return group;
  }

  async updateById(
    id: number,
    attributes: Partial<ICreateGroupAttributes>
  ): Promise<Group | null> {
    const updatedGroup = await this.groupsRepository.updateById(id, attributes);
    if (!updatedGroup) throw new HttpError(404, this.groupNotFoundMessage);
    return updatedGroup;
  }

  async deleteById(id: number): Promise<{ deletedGroup: Group } | null> {
    const deletedGroup = await this.groupsRepository.deleteById(id);
    if (!deletedGroup) throw new HttpError(404, this.groupNotFoundMessage);
    return { deletedGroup };
  }
}
