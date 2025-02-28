import { object, string, array } from "yup";

export const downloadSourceSchema = object({
  name: string().max(255).required(),
  downloads: array(
    object({
      title: string().max(255).required(),
      uris: array(string().required()).required(),
      uploadDate: string().max(255).required(),
      fileSize: string().max(255).required(),
    }).required()
  ).required(),
});
