import { z } from 'zod';

export const DeleteFolderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  folder: z.string().optional(),
});

export const UploadImageSchema = z.object({
  success: z.boolean(),
  files: z.array(z.any())
})

export const UploadsFolderSchema = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string(),
});

export const UploadsFolderArraySchema = z.array(UploadsFolderSchema)


export type DeleteFolderResponse = z.infer<typeof DeleteFolderResponseSchema>;
export type UploadImage = z.infer<typeof UploadImageSchema>;
export type UploadsFolderArray = z.infer<typeof UploadsFolderArraySchema>;
export type UploadsFolder = z.infer<typeof UploadsFolderSchema>;