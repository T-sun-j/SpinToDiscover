'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '../../components/ui/input-group';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';
import { ArrowLeft, Search, Trash2, ChevronDown, User, FileText, ChevronLeft } from 'lucide-react';
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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown-container]')) {
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

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
      setError(t('square.loginRequired') as string);
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
        setError((response.message || t('search.noResults')) as string);
        setUserResults([]);
        setArticleResults([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
        setError('登录已过期，请重新登录');
      } else {
        setError((error instanceof Error ? error.message : t('search.noResults')) as string);
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
    { value: 'posts', label: t('search.searchConditions.articles') },
    { value: 'users', label: t('search.searchConditions.users') },
    // { value: 'brands', label: t('search.searchConditions.brands') },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          {/* Header */}
          <Header 
            showUser={true} 
            logoLink="/"
        />

        {/* 页面标题和返回按钮 */}
        <div className="flex items-center justify-between px-6 py-4 z-100">
					<h1 className="text-xl font-poppins text-[#0F1728] font-semibold">{t('search.title')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#0F1728] hover:text-[#0F1728]"
					>
						<ChevronLeft className="h-7 w-7 z-10" />
					</button>
				</div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Search Condition Dropdown */}
            {/* <div className="relative">
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
            </div> */}

            {/* Keyword Input */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('search.searchPlaceholder') as string}
              className="flex-1 text-[#11295b] px-3 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground ml-2"
              onClick={handleSearch}
            >
              <Image
                src="/img/search.png"
                alt="search"
                width={28}
                height={28}
                className="h-7 w-7 z-10"
              />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12 px-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : hasSearched ? (
          <div className="space-y-6 px-4">
            {/* User Results */}
            {userResults.length > 0 && (
              <div>
                <h2 className="text-[17px] text-[#0F1728] font-poppins font-semibold mb-3">
                  {t('search.users')}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {userResults.map((user) => (
                    <button
                      key={user.userId}
                      onClick={() => handleUserClick(user.userId)}
                      className="flex flex-col items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={buildAvatarUrl(user.avatar)}
                            alt={user.nickname || 'User'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[#0F1728] text-sm font-medium">{user.nickname || 'User'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
           {userResults.length > 0 && articleResults.length > 0 && <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>}
            {/* Article Results */}
            {articleResults.length > 0 && (
              <div>
                <h2 className="text-[17px] text-[#0F1728] font-poppins font-semibold mb-3">
                  {t('search.articles')}
                </h2>
                <div className="">
                  {articleResults.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className="w-full text-left  hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-[17px] font-poppins font-semibold text-[#12295B] italic mb-1">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-[#20313B] text-sm mb-2 leading-relaxed line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      {/* <p className="text-gray-500 text-xs">
                         {article.addtime}
                      </p> */}
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
              <div className="flex items-center justify-between ">
                <h2 className=" text-[17px] text-[#0F1728] font-poppins font-semibold">{t('search.history')}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteHistory}
                  className="text-[#0F1728] hover:text-[#0F1728] p-1"
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
              <div className="space-y-1">
                {searchHistory.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleHistoryClick(item)}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm"
                    >
                      {item}
                    </button>
                    {index !== searchHistory.length - 1 && (
                      <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
                    )}
                  </div>
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
