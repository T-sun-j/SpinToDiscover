"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, ChevronLeft, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { classNames } from '../../lib/utils/classNames';
import { UI_CONSTANTS, HISTORY_CONSTANTS } from '../../lib/constants';

export default function RegionSelectPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('Shanghai');
    const [searchResults, setSearchResults] = useState<typeof regions>([]);
    const [isSearching, setIsSearching] = useState(false);

    // 真实地区数据 - 中国主要城市
    const regions = [
        { name: 'Shanghai', country: 'China', fullName: 'Shanghai, China' },
        { name: 'Beijing', country: 'China', fullName: 'Beijing, China' },
        { name: 'Guangzhou', country: 'China', fullName: 'Guangzhou, China' },
        { name: 'Shenzhen', country: 'China', fullName: 'Shenzhen, China' },
        { name: 'Hangzhou', country: 'China', fullName: 'Hangzhou, China' },
        { name: 'Nanjing', country: 'China', fullName: 'Nanjing, China' },
        { name: 'Chengdu', country: 'China', fullName: 'Chengdu, China' },
        { name: 'Wuhan', country: 'China', fullName: 'Wuhan, China' },
        { name: 'Xi\'an', country: 'China', fullName: 'Xi\'an, China' },
        { name: 'Suzhou', country: 'China', fullName: 'Suzhou, China' },
        { name: 'Tianjin', country: 'China', fullName: 'Tianjin, China' },
        { name: 'Chongqing', country: 'China', fullName: 'Chongqing, China' },
        { name: 'Dongguan', country: 'China', fullName: 'Dongguan, China' },
        { name: 'Foshan', country: 'China', fullName: 'Foshan, China' },
        { name: 'Qingdao', country: 'China', fullName: 'Qingdao, China' },
        { name: 'Dalian', country: 'China', fullName: 'Dalian, China' },
        { name: 'Xiamen', country: 'China', fullName: 'Xiamen, China' },
        { name: 'Ningbo', country: 'China', fullName: 'Ningbo, China' },
        { name: 'Changsha', country: 'China', fullName: 'Changsha, China' },
        { name: 'Zhengzhou', country: 'China', fullName: 'Zhengzhou, China' },
        { name: 'Jinan', country: 'China', fullName: 'Jinan, China' },
        { name: 'Harbin', country: 'China', fullName: 'Harbin, China' },
        { name: 'Fuzhou', country: 'China', fullName: 'Fuzhou, China' },
        { name: 'Kunming', country: 'China', fullName: 'Kunming, China' },
        { name: 'Shijiazhuang', country: 'China', fullName: 'Shijiazhuang, China' },
        { name: 'Nanchang', country: 'China', fullName: 'Nanchang, China' },
        { name: 'Taiyuan', country: 'China', fullName: 'Taiyuan, China' },
        { name: 'Hefei', country: 'China', fullName: 'Hefei, China' },
        { name: 'Nanning', country: 'China', fullName: 'Nanning, China' },
        { name: 'Guiyang', country: 'China', fullName: 'Guiyang, China' },
        // 国际城市
        { name: 'New York', country: 'USA', fullName: 'New York, USA' },
        { name: 'Los Angeles', country: 'USA', fullName: 'Los Angeles, USA' },
        { name: 'London', country: 'UK', fullName: 'London, UK' },
        { name: 'Paris', country: 'France', fullName: 'Paris, France' },
        { name: 'Tokyo', country: 'Japan', fullName: 'Tokyo, Japan' },
        { name: 'Seoul', country: 'South Korea', fullName: 'Seoul, South Korea' },
        { name: 'Singapore', country: 'Singapore', fullName: 'Singapore, Singapore' },
        { name: 'Hong Kong', country: 'Hong Kong', fullName: 'Hong Kong, Hong Kong' },
        { name: 'Sydney', country: 'Australia', fullName: 'Sydney, Australia' },
        { name: 'Melbourne', country: 'Australia', fullName: 'Melbourne, Australia' },
        { name: 'Toronto', country: 'Canada', fullName: 'Toronto, Canada' },
        { name: 'Vancouver', country: 'Canada', fullName: 'Vancouver, Canada' },
        { name: 'Berlin', country: 'Germany', fullName: 'Berlin, Germany' },
        { name: 'Munich', country: 'Germany', fullName: 'Munich, Germany' },
        { name: 'Amsterdam', country: 'Netherlands', fullName: 'Amsterdam, Netherlands' },
        { name: 'Barcelona', country: 'Spain', fullName: 'Barcelona, Spain' },
        { name: 'Madrid', country: 'Spain', fullName: 'Madrid, Spain' },
        { name: 'Rome', country: 'Italy', fullName: 'Rome, Italy' },
        { name: 'Milan', country: 'Italy', fullName: 'Milan, Italy' },
        { name: 'Zurich', country: 'Switzerland', fullName: 'Zurich, Switzerland' }
    ];

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
                            placeholder={t('regionSelect.searchHint')}
                            className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        />
                    </div>
                </div>

                {/* 搜索结果 */}
                <div className="flex-1 px-6">
                    {searchQuery && (
                        <div className="space-y-2">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    <span className="ml-2 text-sm text-gray-500">{t('regionSelect.searching')}</span>
                                </div>
                            ) : (
                                <>
                                    {/* 当前选择的地区 */}
                                    {selectedRegion && selectedRegion !== 'Shanghai' && (
                                        <div 
                                            className="bg-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
                                        >
                                            <span className="text-sm font-nunito text-[#11295b]">{selectedRegion}</span>
                                            <Button
                                                onClick={handleConfirm}
                                                className="bg-[#11295b] text-white rounded-md font-nunito font-semibold px-3 ml-3 text-xs min-w-0 h-8"
                                            >
                                                {t('regionSelect.confirm')}
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {/* 搜索结果列表 */}
                                    {searchResults.length > 0 ? (
                                        searchResults.map((region, index) => (
                                            <div key={index}>
                                                <div 
                                                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors max-h-12"
                                                    onClick={() => handleSelectRegion(region)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-nunito text-[#11295b] font-semibold">{region.name}</span>
                                                        <span className="text-xs text-gray-500">{region.country}</span>
                                                    </div>
                                                </div>
                                                {index < searchResults.length - 1 && (
                                                    <div className="mx-3 border-b border-gray-200"></div>
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
