'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ArrowLeft, Search, ChevronDown, User, FileText } from 'lucide-react';
import Image from 'next/image';

interface UserResult {
  id: string;
  name: string;
  avatar: string;
}

interface ArticleResult {
  id: string;
  title: string;
  description: string;
  author: string;
}

export default function SearchResultsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchCondition, setSearchCondition] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [articleResults, setArticleResults] = useState<ArticleResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Get search parameters from URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    setKeyword(query);
    setSearchCondition(type);
    
    if (query) {
      performSearch(query, type);
    }
  }, [searchParams]);

  const performSearch = async (query: string, type: string) => {
    setLoading(true);
    
    // Simulate API call - replace with actual API calls
    setTimeout(() => {
      // Mock user results
      const mockUsers: UserResult[] = [
        { id: '1', name: 'Miaham', avatar: '/img/logo-1.png' },
        { id: '2', name: 'Miaham', avatar: '/img/logo-1.png' },
        { id: '3', name: 'Miaham', avatar: '/img/logo-1.png' },
      ];

      // Mock article results
      const mockArticles: ArticleResult[] = [
        {
          id: '1',
          title: 'Title or central idea content text.',
          description: 'This is an introduction text about some brand stories and features of this product, which is edited and uploaded to the system by each buyer, and published after being reviewed by the administrator.',
          author: 'Miaham'
        },
        {
          id: '2',
          title: 'Title or central idea content text.',
          description: 'This is an introduction text about some brand stories and features of this product, which is edited and uploaded to the system by each buyer, and published after being reviewed by the administrator.',
          author: 'Miaham'
        }
      ];

      // Filter results based on search type
      if (type === 'all' || type === 'users') {
        setUserResults(mockUsers);
      } else {
        setUserResults([]);
      }

      if (type === 'all' || type === 'articles') {
        setArticleResults(mockArticles);
      } else {
        setArticleResults([]);
      }

      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(keyword.trim())}&type=${searchCondition}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserClick = (userId: string) => {
    // Navigate to user profile page
    router.push(`/user/${userId}`);
  };

  const handleArticleClick = (articleId: string) => {
    // Navigate to article detail page
    router.push(`/article/${articleId}`);
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

        {/* Main Content */}
        <div className="p-4">
          {/* 页面标题和返回按钮 */}
          <div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-semibold text-[#093966] font-poppins">{t('search.title')}</h1>
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
          <div className="mb-6">
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
                          performSearch(keyword, condition.value);
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

          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Results */}
              {userResults.length > 0 && (
                <div>
                  <h2 className="text-base font-medium text-gray-900 mb-3 font-poppins">
                    {t('search.users')}
                  </h2>
                  <div className="space-y-2">
                    {userResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-gray-900 text-sm">{user.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Results */}
              {articleResults.length > 0 && (
                <div>
                  <h2 className="text-base font-medium text-gray-900 mb-3 font-poppins">
                    {t('search.articles')}
                  </h2>
                  <div className="space-y-3">
                    {articleResults.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleClick(article.id)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                          {article.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {t('square.publisher')}: {article.author}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {userResults.length === 0 && articleResults.length === 0 && keyword && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">{t('search.noResults')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}
