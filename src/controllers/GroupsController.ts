import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { IGroupsRepository } from "../repositories/GroupsRepository";

export class GroupsController {
  private readonly groupsRepository: IGroupsRepository;

  constructor(groupsRepository: IGroupsRepository) {
    this.groupsRepository = groupsRepository;
  }

  getAll: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsRepository.findAll();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const group = await this.groupsRepository.create(body);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const group = await this.groupsRepository.findById(+req.params.id);
      if (!group) throw new HttpError(404, "Grupo não encontrado!");
      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  updateById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);
      const updatedGroup = await this.groupsRepository.updateById(id, body);
      if (!updatedGroup) throw new HttpError(404, "Grupo não encontrado!");
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  deleteById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsRepository.deleteById(id);
      if (!deletedGroup) throw new HttpError(404, "Grupo não encontrado!");
      res.json(deletedGroup);
    } catch (error) {
      next(error);
    }
  };
}
