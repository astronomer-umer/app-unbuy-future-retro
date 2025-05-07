import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
     const formData = await request.formData();
     const file = formData.get("file") as File;

     if (!file) {
          return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
     }

     const fileName = `${uuidv4()}-${file.name}`;
     const filePath = path.join(process.cwd(), "public/uploads", fileName);

     try {
          await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
          return NextResponse.json({ url: `/uploads/${fileName}` });
     } catch (error) {
          return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
     }
}