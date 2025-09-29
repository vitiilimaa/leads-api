import { LeadsRepository } from "./repositories/LeadsRepository";
import { LeadsService } from "./services/LeadsService";
import { LeadsController } from "./controllers/LeadsController";

import { CampaignsRepository } from "./repositories/CampaignsRepository";
import { CampaignsController } from "./controllers/CampaignsController";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController";

import { GroupsRepository } from "./repositories/GroupsRepository";
import { GroupsService } from "./services/GroupsService";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsService } from "./services/CampaignsService";

const leadsRepository = new LeadsRepository();
const leadsService = new LeadsService(leadsRepository);
export const leadsController = new LeadsController(leadsService);

const groupsRepository = new GroupsRepository();
const groupsService = new GroupsService(groupsRepository);
export const groupsController = new GroupsController(groupsService);

const campaignsRepository = new CampaignsRepository();
const campaignService = new CampaignsService(campaignsRepository);
export const campaignsController = new CampaignsController(campaignService);

export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsRepository,
  leadsRepository
);
