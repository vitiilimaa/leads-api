-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('New', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Archived');

-- CreateEnum
CREATE TYPE "public"."CampaignLeadStatus" AS ENUM ('New', 'Engaged', 'FollowUp_Scheduled', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Re_Engaged', 'Opted_Out');

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampaignLead" (
    "leadId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "status" "public"."CampaignLeadStatus" NOT NULL DEFAULT 'New',

    CONSTRAINT "CampaignLead_pkey" PRIMARY KEY ("leadId","campaignId")
);

-- CreateTable
CREATE TABLE "public"."_GroupLeads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupLeads_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "public"."Lead"("email");

-- CreateIndex
CREATE INDEX "_GroupLeads_B_index" ON "public"."_GroupLeads"("B");

-- AddForeignKey
ALTER TABLE "public"."CampaignLead" ADD CONSTRAINT "CampaignLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignLead" ADD CONSTRAINT "CampaignLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GroupLeads" ADD CONSTRAINT "_GroupLeads_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GroupLeads" ADD CONSTRAINT "_GroupLeads_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
