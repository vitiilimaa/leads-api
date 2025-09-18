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
router.put("/leads/:id", leadsController.update);
router.delete("/leads/:id", leadsController.delete);

router.get("/groups", groupsController.getAll);
router.post("/groups", groupsController.create);
router.get("/groups/:id", groupsController.getById);
router.put("/groups/:id", groupsController.update);
router.delete("/groups/:id", groupsController.delete);

router.get("/groups/:id/leads", groupLeadsController.getLeads);
router.post("/groups/:id/leads", groupLeadsController.addLead);
router.delete(
  "/groups/:groupId/leads/:leadId",
  groupLeadsController.removeLead
);

router.get("/campaigns", campaignsController.getAll);
router.post("/campaigns", campaignsController.create);
router.get("/campaigns/:id", campaignsController.getById);
router.put("/campaigns/:id", campaignsController.update);
router.delete("/campaigns/:id", campaignsController.delete);

router.get("/campaigns/:id/leads", campaignLeadsController.getLeads);
router.post("/campaigns/:id/leads", campaignLeadsController.addLead);
router.put(
  "/campaigns/:campaignId/leads/:leadId",
  campaignLeadsController.updateLeadStatus
);
router.delete(
  "/campaigns/:campaignId/leads/:leadId",
  campaignLeadsController.removeLead
);

export { router };
