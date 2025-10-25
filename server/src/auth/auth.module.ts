import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {GithubStrategy} from "./github.strategy";
import { SessionSerializer } from './session.serializer';

@Module({
  controllers: [AuthController],
  providers: [AuthService,GithubStrategy,SessionSerializer]
})
export class AuthModule {}
