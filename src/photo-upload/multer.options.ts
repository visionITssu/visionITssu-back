import { randomUUID, RandomUUIDOptions } from "crypto";
import { existsSync, mkdirSync} from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";

export const MulterOptions = {
    storage: diskStorage({
        destination:(req, file, cb) =>{
            const uploadPath = join(process.cwd(), 'src', 'uploads');

            if(!existsSync(uploadPath)){
                mkdirSync(uploadPath, {recursive: true});
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, randomUUID() + extname(file.originalname));
        },
    }),
};
