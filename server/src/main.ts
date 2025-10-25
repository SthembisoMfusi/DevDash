import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);


  app.use(
        session({
            secret: configService.get('SESSION_SECRET') as string,
            resave: false,
            saveUninitialized: false,
        }),
    );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
