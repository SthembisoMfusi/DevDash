import { Module } from '@nestjs/common';
import { IssueTemplatesService } from './issue-templates.service';
import { IssueTemplatesController } from './issue-templates.controller';
import { PrismaService } from '../prisma/prisma.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [IssuesModule],
  controllers: [IssueTemplatesController],
  providers: [IssueTemplatesService, PrismaService],
  exports: [IssueTemplatesService],
})
export class IssueTemplatesModule {}
