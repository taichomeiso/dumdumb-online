export const Footer = () => {
  return (
    <footer className="bg-black text-white mt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">dumdumb</h3>
            <p className="text-gray-400">
              スタイリッシュなショッピング体験をお届けします
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>東京都渋谷区</li>
              <li>contact@example.com</li>
              <li>03-1234-5678</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">フォローする</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 dumdumb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
