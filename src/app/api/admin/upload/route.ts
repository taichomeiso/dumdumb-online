import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    // ファイル名から拡張子を取得
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: '許可されていないファイル形式です' },
        { status: 400 }
      );
    }

    // ファイル名を一意にする
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `product-${uniqueSuffix}.${fileExtension}`;

    // Buffer に変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 保存先のパスを設定
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    
    // uploads ディレクトリが存在しない場合は作成
    try {
      await writeFile(join(uploadsDir, 'test.txt'), '');
    } catch {
      await writeFile(join(publicDir, 'uploads'), '');
    }

    // ファイルを保存
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // 公開URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}