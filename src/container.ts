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

export const leadsRepository = new LeadsRepository();
export const leadsService = new LeadsService(leadsRepository);
export const leadsController = new LeadsController(leadsService);

export const groupsRepository = new GroupsRepository();
export const groupsService = new GroupsService(groupsRepository);
export const groupsController = new GroupsController(groupsService);

export const campaignsRepository = new CampaignsRepository();
export const campaignsService = new CampaignsService(campaignsRepository);
export const campaignsController = new CampaignsController(campaignsService);

export const groupLeadsController = new GroupLeadsController(
  groupsService,
  leadsService
);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsService,
  leadsService
);
