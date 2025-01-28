import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
      status: 401,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'ファイルが必要です' }), {
        status: 400,
      });
    }

    // ファイル名をハッシュ化して一意にする
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const ext = file.name.split('.').pop();
    const fileName = `${hash}.${ext}`;

    // publicディレクトリ内のuploadsフォルダにファイルを保存
    const path = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(path, buffer);

    // 保存したファイルのURLを返す
    const url = `/uploads/${fileName}`;
    return new NextResponse(JSON.stringify({ url }), {
      status: 200,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(JSON.stringify({ error: 'ファイルのアップロードに失敗しました' }), {
      status: 500,
    });
  }
}