import { Router } from "express";
import {
  campaignLeadsController,
  campaignsController,
  groupLeadsController,
  groupsController,
  leadsController,
} from "./container";

const router = Router();

router.get("/leads", leadsController.getAll);
router.post("/leads", leadsController.create);
router.get("/leads/:id", leadsController.getById);
router.put("/leads/:id", leadsController.updateById);
router.delete("/leads/:id", leadsController.deleteById);

router.get("/groups", groupsController.getAll);
router.post("/groups", groupsController.create);
router.get("/groups/:id", groupsController.getById);
router.put("/groups/:id", groupsController.updateById);
router.delete("/groups/:id", groupsController.deleteById);

router.get("/groups/:groupId/leads", groupLeadsController.getLeads);
router.post("/groups/:groupId/leads", groupLeadsController.addLead);
router.delete(
  "/groups/:groupId/leads/:leadId",
  groupLeadsController.removeLead
);

router.get("/campaigns", campaignsController.getAll);
router.post("/campaigns", campaignsController.create);
router.get("/campaigns/:id", campaignsController.getById);
router.put("/campaigns/:id", campaignsController.updateById);
router.delete("/campaigns/:id", campaignsController.deleteById);

router.get("/campaigns/:campaignId/leads", campaignLeadsController.getLeads);
router.post("/campaigns/:campaignId/leads", campaignLeadsController.addLead);
router.put(
  "/campaigns/:campaignId/leads/:leadId",
  campaignLeadsController.updateLeadStatus
);
router.delete(
  "/campaigns/:campaignId/leads/:leadId",
  campaignLeadsController.removeLead
);

export { router };
