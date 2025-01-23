import { headers } from 'next/headers';

export default async function Home() {
  const headersList = headers();
  const domain = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  return (
    <>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${protocol}://${domain}/store`} />
      </head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>リダイレクト中...</p>
          <a href="/store" className="text-blue-600 hover:underline">
            自動的に移動しない場合はこちらをクリック
          </a>
        </div>
      </div>
    </>
  );
}