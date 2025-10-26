import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { IssuesModule } from './issues/issues.module';
import { MilestonesModule } from './milestones/milestones.module';
import { GitHubModule } from './github/github.module';
import { IssueTemplatesModule } from './issue-templates/issue-templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ session: true }),
    AuthModule,
    ProjectsModule,
    IssuesModule,
    MilestonesModule,
    GitHubModule,
    IssueTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
