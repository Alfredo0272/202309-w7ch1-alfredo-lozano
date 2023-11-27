import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class FileInterceptor {
  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const options: multer.Options = {
      // Dest: 'uploads',
      storage: multer.diskStorage({
        destination: './public/upload',
        filename(_req, file, callback) {
          const prefix = crypto.randomUUID();
          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize },
    };
    const middleware = multer(options).single(fileName);
    return (req: Request, res: Response, next: NextFunction) => {
      const previusBody = req.body;
      middleware(req, res, next);
      req.body = { ...previusBody, ...req.body };
    };
  }
}
