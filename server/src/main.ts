import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  });

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') as string,
      resave: false,
      saveUninitialized: false,
            cookie: {
              secure: false, // Set to true in production with HTTPS
              httpOnly: true, // Secure cookie setting
              maxAge: 24 * 60 * 60 * 1000, // 24 hours
              sameSite: 'lax', // Allow cross-site requests
              path: '/', // Ensure cookie is available for all paths
            },
      name: 'connect.sid', // Explicit session name
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());


  await app.listen(3000);
}

void bootstrap();
