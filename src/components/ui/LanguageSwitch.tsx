'use client';

import { useState } from 'react';

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export function LanguageSwitch() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ja');

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium">{languages.find(lang => lang.code === selectedLang)?.label}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedLang === lang.code ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}