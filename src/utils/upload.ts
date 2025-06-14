// utils/upload.ts
import { promises as fs } from "fs";
import { NextRequest } from "next/server";
import path from "path";

export const parseFormData = async (req: NextRequest) => {
  const formData = await req.formData();
  const files: File[] = [];
  const fields: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files.push(value);
    } else {
      fields[key] = value as string;
    }
  }

  return { files, fields };
};

export const saveFile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const tempDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, file.name);
  await fs.writeFile(tempPath, buffer);
  return tempPath;
};
