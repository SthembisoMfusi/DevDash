import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './github.strategy';
import { SessionSerializer } from './session.serializer';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, SessionSerializer, PrismaService],
})
export class AuthModule {}
