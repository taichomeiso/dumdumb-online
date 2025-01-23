export const HeroSection = () => {
  return (
    <section className="bg-black text-white py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            スタイリッシュなショッピング体験
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            最新のトレンドアイテムをお届けします
          </p>
          <a
            href="#featured"
            className="inline-block bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            商品を見る
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0"></div>
    </section>
  );
};