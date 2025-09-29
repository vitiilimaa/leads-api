import { Handler } from "express";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";

export class GroupsController {
  private readonly groupsService: GroupsService;

  constructor(groupsService: GroupsService) {
    this.groupsService = groupsService;
  }

  getAll: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.findAll();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const group = await this.groupsService.create(body);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  };

  getById: Handler = async (req, res, next) => {
    try {
      const group = await this.groupsService.findById(+req.params.id);
      res.json(group);
    } catch (error) {
      next(error);
    }
  };

  updateById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);
      const updatedGroup = await this.groupsService.updateById(id, body);
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  deleteById: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsService.deleteById(id);
      res.json(deletedGroup);
    } catch (error) {
      next(error);
    }
  };
}
