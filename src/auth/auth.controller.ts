import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import type { Response } from 'express';

@Controller()
export class AuthController {
  @Get()
  root(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
