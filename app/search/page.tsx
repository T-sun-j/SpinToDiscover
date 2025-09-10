'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Search, Trash2, ChevronDown } from 'lucide-react';

export default function SearchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchCondition, setSearchCondition] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (newHistory: string[]) => {
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      // Add to search history if not already present
      const newHistory = [keyword.trim(), ...searchHistory.filter(item => item !== keyword.trim())].slice(0, 10);
      saveSearchHistory(newHistory);
      
      // Navigate to search results page
      router.push(`/search/results?q=${encodeURIComponent(keyword.trim())}&type=${searchCondition}`);
    }
  };

  const handleHistoryClick = (historyItem: string) => {
    setKeyword(historyItem);
    router.push(`/search/results?q=${encodeURIComponent(historyItem)}&type=${searchCondition}`);
  };

  const handleDeleteHistory = () => {
    saveSearchHistory([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  	// 处理返回
	const handleBack = () => {
		router.back();
	};

  const searchConditions = [
    { value: 'all', label: t('search.searchConditions.all') },
    { value: 'articles', label: t('search.searchConditions.articles') },
    { value: 'users', label: t('search.searchConditions.users') },
    { value: 'brands', label: t('search.searchConditions.brands') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <Header 
          showLanguage={true} 
          showUser={true} 
          logoLink="/"
          className="border-b border-gray-200"
        />

        {/* 页面标题和返回按钮 */}
        <div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-semibold text-[#093966]">{t('search.title')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#093966] hover:text-[#093966]"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Search Condition Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 bg-gray-100 border-gray-300 text-gray-700 px-3 py-2 h-10 min-w-[80px]"
              >
                {searchConditions.find(condition => condition.value === searchCondition)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {searchConditions.map((condition) => (
                    <button
                      key={condition.value}
                      onClick={() => {
                        setSearchCondition(condition.value);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                    >
                      {condition.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Keyword Input */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('search.searchPlaceholder')}
              className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
            />

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 h-10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium text-gray-900">{t('search.history')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteHistory}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}
