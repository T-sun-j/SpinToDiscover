'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';
import { ArrowLeft, Search, Trash2, ChevronDown, User, FileText } from 'lucide-react';
import Image from 'next/image';
import { searchContent } from '../../lib/auth';
import { UserSearchResult, ArticleSearchResult, buildAvatarUrl } from '../../lib/api';

export default function SearchPage() {
  const { t } = useLanguage();
  const { authInfo } = useAuth();
  const router = useRouter();
  const [searchCondition, setSearchCondition] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [articleResults, setArticleResults] = useState<ArticleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

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

  const performSearch = async (query: string, type: string) => {
    if (!query.trim()) {
      setUserResults([]);
      setArticleResults([]);
      setHasSearched(false);
      return;
    }

    if (!authInfo) {
      setError(t('square.loginRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await searchContent({
        userId: authInfo.userId,
        token: authInfo.token,
        typeid: type,
        title: query.trim(),
      });

      if (response.success) {
        // 根据搜索类型设置结果
        if (type === 'all' || type === 'users') {
          setUserResults(response.userDataList || []);
        } else {
          setUserResults([]);
        }

        if (type === 'all' || type === 'articles') {
          setArticleResults(response.articleDataList || []);
        } else {
          setArticleResults([]);
        }
        setHasSearched(true);
      } else {
        setError(response.message || t('search.noResults'));
        setUserResults([]);
        setArticleResults([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
        setError('登录已过期，请重新登录');
      } else {
        setError(error instanceof Error ? error.message : t('search.noResults'));
      }
      setUserResults([]);
      setArticleResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      // Add to search history if not already present
      const newHistory = [keyword.trim(), ...searchHistory.filter(item => item !== keyword.trim())].slice(0, 10);
      saveSearchHistory(newHistory);
      
      // Perform search directly
      performSearch(keyword.trim(), searchCondition);
    }
  };

  const handleHistoryClick = (historyItem: string) => {
    setKeyword(historyItem);
    performSearch(historyItem, searchCondition);
  };

  const handleDeleteHistory = () => {
    saveSearchHistory([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserClick = (userId: string) => {
    // Navigate to user profile page
    router.push(`/personal/${userId}`);
  };

  const handleArticleClick = (articleId: string) => {
    // Navigate to article detail page
    router.push(`/square/${articleId}`);
  };

  // 处理返回 - 返回到首页而不是上一页
  const handleBack = () => {
    router.push('/square');
  };

  const searchConditions = [
    { value: 'all', label: t('search.searchConditions.all') },
    { value: 'articles', label: t('search.searchConditions.articles') },
    { value: 'users', label: t('search.searchConditions.users') },
    { value: 'brands', label: t('search.searchConditions.brands') },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          {/* Header */}
          <Header 
            showUser={true} 
            logoLink="/"
          className="border-b border-gray-200"
        />

        {/* 页面标题和返回按钮 */}
        <div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl text-[#11295b] font-poppins">{t('search.title')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#11295b] hover:text-[#11295b]"
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
                <div className="absolute top-full text-[#11295b] left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {searchConditions.map((condition) => (
                    <button
                      key={condition.value}
                      onClick={() => {
                        setSearchCondition(condition.value);
                        setShowDropdown(false);
                        if (keyword.trim()) {
                          performSearch(keyword.trim(), condition.value);
                        }
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
              className="flex-1 text-[#11295b] px-3 py-2 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : hasSearched ? (
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
                        {user.avatar ? (
                          <Image
                            src={buildAvatarUrl(user.avatar)}
                            alt={user.name || 'User'}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-gray-500 text-xs">{user.addtime}</p>
                      </div>
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
                      {article.description && (
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                         {article.addtime}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {userResults.length === 0 && articleResults.length === 0 && keyword && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">{t('search.noResults')}</p>
              </div>
            )}
          </div>
        ) : (
          /* Search History */
          searchHistory.length > 0 && (
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium text-gray-900 font-poppins">{t('search.history')}</h2>
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
          )
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
