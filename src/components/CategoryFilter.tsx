import { Button } from "@/components/ui/button";

const categories = [
  { id: 'all', label: 'All' },
  { id: 'tshirt', label: 'Tシャツ' },
  { id: 'hoodie', label: 'パーカー' },
  { id: 'cup', label: 'コップ' },
  { id: 'sticker', label: 'ステッカー' },
  { id: 'other', label: 'その他' }
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
