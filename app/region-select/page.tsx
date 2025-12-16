"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, ChevronLeft, Globe, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { classNames } from '../../lib/utils/classNames';
import { UI_CONSTANTS, HISTORY_CONSTANTS } from '../../lib/constants';
import { cities, City } from '../../lib/data/cities';

export default function RegionSelectPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    // 从 URL 参数获取 filterLocation，如果有则使用，否则使用默认值
    const filterLocationParam = searchParams.get('filterLocation') 
        ? decodeURIComponent(searchParams.get('filterLocation') || '') 
        : null;
    const [selectedRegion, setSelectedRegion] = useState(filterLocationParam || '');
    const [hasUserSelected, setHasUserSelected] = useState(false); // 标记用户是否选择了新位置
    const [searchResults, setSearchResults] = useState<City[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // 使用外部导入的城市数据
    const regions = cities;

    // 处理搜索
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(true);
        
        // 模拟搜索延迟
        setTimeout(() => {
            const results = regions.filter(region => 
                region.name.toLowerCase().includes(query.toLowerCase()) ||
                region.fullName.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
            setIsSearching(false);
        }, 300);
    };

    // 选择地区
    const handleSelectRegion = (region: typeof regions[0]) => {
        setSelectedRegion(region.fullName);
        setHasUserSelected(true); // 标记用户已选择新位置
        
        // 跳转到页面顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 确认选择
    const handleConfirm = () => {
        // 获取来源页面信息
        const from = searchParams.get('from'); // 来源页面：recommend, following, nearby
        const currentTab = searchParams.get('tab'); // 当前tab
        
        // 构建返回URL，包含选择的地区信息
        let returnUrl = '/square';
        
        // 根据来源页面和当前tab决定返回URL
        if (from === 'square') {
            returnUrl += `?location=${encodeURIComponent(selectedRegion)}`;
            
        } else {
            // 默认返回广场页面，并传递地区信息
            returnUrl = `/square?location=${encodeURIComponent(selectedRegion)}`;
        }
        
        console.log('Selected region:', selectedRegion);
        console.log('Return URL:', returnUrl);
        
        // 跳转回来源页面，并传递地区信息
        router.push(returnUrl);
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="flex min-h-[100vh] flex-col">
                {/* Header */}
                <Header
                    showSearch
                    showUser
                    userLink="/personal-center"
                />

                {/* 页面标题和返回按钮 */}
                <div className={classNames(
                    HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
                    UI_CONSTANTS.SPACING.PX_6,
                    'py-4',
                    'text-[#0F1728]',
                    'z-100'
                )}>
                    <h1 className={classNames(
                        'text-xl text-[#0F1728] font-poppins font-semibold',
                    )}>{t('regionSelect.title')}</h1>
                    <button
                        onClick={() => router.back()}
                        className={classNames(
                            'text-[#0F1728]',
                            'hover:text-[#0F1728]'
                        )}
                    >
                        <ChevronLeft className='h-7 w-7 z-10' />
                    </button>
                </div>


                {/* 搜索框 */}
                <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'mb-6')}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t('regionSelect.searchHint') as string}
                            className="w-full rounded-full bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        />
                    </div>
                </div>

                {/* 已选择的位置 - 显示在搜索框下方，如果用户没有选择新位置 */}
                {filterLocationParam && !hasUserSelected && (
                    <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'mb-4')}>
                        <div 
                            className="bg-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
                        >
                            <span className="text-sm font-nunito text-[#11295b]">{filterLocationParam}</span>
                            <button
                                onClick={() => {
                                    // 清除筛选，跳转回首页
                                    router.push('/square');
                                }}
                                className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                                title="清除筛选"
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 搜索结果 */}
                <div className="flex-1 px-6">
                    {searchQuery && (
                        <div className="space-y-2">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 "></div>
                                    <span className="ml-2 text-sm text-gray-500">{t('regionSelect.searching')}</span>
                                </div>
                            ) : (
                                <>
                                    {/* 当前选择的地区 - 如果用户新选择了位置 */}
                                    {selectedRegion && (hasUserSelected || !filterLocationParam) && (
                                        <div 
                                            className="bg-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-200 transition-colors mb-2"
                                        >
                                            <span className="text-sm font-nunito text-[#11295b]">{selectedRegion}</span>
                                            <div className="flex items-center gap-2">
                                            <Button
                                                onClick={handleConfirm}
                                                    className="bg-[#11295b] text-white rounded-md font-nunito font-semibold px-3 text-xs min-w-0 h-8"
                                            >
                                                {t('regionSelect.confirm')}
                                            </Button>
                                                <button
                                                    onClick={() => {
                                                        // 清除选择
                                                        setSelectedRegion('');
                                                        setHasUserSelected(false);
                                                    }}
                                                    className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                                                    title="清除选择"
                                                >
                                                    <X className="h-4 w-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* 搜索结果列表 */}
                                    {searchResults.length > 0 ? (
                                        searchResults.map((region, index) => (
                                            <div key={index}>
                                                <div 
                                                    className="p-2 cursor-pointer hover:bg-gray-50 transition-colors max-h-14"
                                                    onClick={() => handleSelectRegion(region)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-nunito text-[#11295b] font-semibold">{region.name}</span>
                                                        <span className="text-xs text-gray-500">{region.country}</span>
                                                    </div>
                                                </div>
                                                {index < searchResults.length - 1 && (
                                                   <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="text-center">
                                                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">{t('regionSelect.noResults')}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* 默认状态 - 提示用户搜索 */}
                    {!searchQuery && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">{t('regionSelect.searchHint')}</h3>
                                <p className="text-sm text-gray-500">{t('regionSelect.searchDescription')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 确认按钮 */}
                <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                    
                </div>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
}
