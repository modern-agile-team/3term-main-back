import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerOptions = {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${path.extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
