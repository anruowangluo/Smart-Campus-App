import React, { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '../components/Icon';
import PageOverlay from '../components/PageOverlay';
import { MOCK_ALL_SERVICES } from '../api/index'; // Import data for Apps search

interface SearchPageProps {
  onBack?: () => void;
  type?: 'global' | 'apps';
}

// Global Mock Data
const GLOBAL_HISTORY = ['图书馆开馆时间', '高等数学', '校车时刻表', '奖学金'];
const GLOBAL_TRENDING = [
  { rank: 1, title: '2024寒假放假通知', hot: true },
  { rank: 2, title: '百团大战社团招新', hot: true },
  { rank: 3, title: '四六级准考证打印', hot: false },
  { rank: 4, title: '校园十佳歌手', hot: false },
  { rank: 5, title: '教务系统选课', hot: false },
];

const GLOBAL_MOCK_RESULTS = [
  { id: 'u1', type: 'user', title: '张老师', sub: '计算机学院 / 辅导员', avatar: '张', color: 'bg-blue-100 text-blue-600' },
  { id: 's1', type: 'service', title: '成绩查询', sub: '教务服务', icon: 'score', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'p1', type: 'post', title: '关于图书馆闭馆的讨论', sub: '包含关键词 "图书馆"', icon: 'article', color: 'text-gray-500', bg: 'bg-gray-100' },
];

// Apps Mock Data
const APPS_HISTORY = ['成绩查询', '课程表', '电费', '图书馆'];
const APPS_TRENDING = [
  { rank: 1, title: '考试安排', hot: true },
  { rank: 2, title: '空闲教室', hot: true },
  { rank: 3, title: '电费充值', hot: false },
  { rank: 4, title: '校车时刻', hot: false },
  { rank: 5, title: '报修服务', hot: false },
];

const SearchPage: React.FC<SearchPageProps> = ({ onBack, type = 'global' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    setTimeout(() => {
        inputRef.current?.focus();
    }, 350); // Wait for slide animation
  }, []);

  // Determine current config based on type
  const config = useMemo(() => {
    if (type === 'apps') {
        return {
            placeholder: '搜索服务、功能 (如: 成绩, 电费)',
            history: APPS_HISTORY,
            trending: APPS_TRENDING,
        };
    }
    return {
        placeholder: '搜索用户、动态、服务...',
        history: GLOBAL_HISTORY,
        trending: GLOBAL_TRENDING,
    };
  }, [type]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
    }
    
    setIsSearching(true);
    
    // Logic split based on type
    if (type === 'apps') {
        // Simulate local filtering for Apps
        const allServices = Object.values(MOCK_ALL_SERVICES).flat();
        // Deduplicate services for search result
        const uniqueServices = new Map();
        allServices.forEach(s => uniqueServices.set(s.name, s));
        const items = Array.from(uniqueServices.values());
        
        const filtered = items.filter(s => s.name.toLowerCase().includes(text.toLowerCase()));
        
        // Format to match the result render structure
        const formattedResults = filtered.map(s => ({
            id: s.id,
            type: 'service',
            title: s.name,
            sub: '应用服务',
            icon: s.icon,
            color: s.color,
            bg: s.bgColor
        }));

        setResults(formattedResults);
        // Instant result for local data
    } else {
        // Simulate API delay for Global
        setTimeout(() => {
            setResults(GLOBAL_MOCK_RESULTS.filter(r => r.title.includes(text) || r.sub.includes(text) || text === 'test'));
        }, 300);
    }
  };

  const clearHistory = () => {
    alert("历史记录已清除");
  };

  return (
    <PageOverlay onClose={onBack}>
      {/* Header */}
      <header className="flex-none flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e2634] border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 h-10">
            <Icon name="search" size={20} className="text-gray-400 shrink-0" />
            <input 
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-gray-400 px-2"
                placeholder={config.placeholder}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {query && (
                <button onClick={() => handleSearch('')} className="text-gray-400 hover:text-gray-600">
                    <Icon name="cancel" size={18} filled />
                </button>
            )}
        </div>
        <button 
            onClick={onBack}
            className="text-slate-600 dark:text-slate-300 font-medium text-sm px-1"
        >
            取消
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark">
        {!query.trim() ? (
            <div className="p-5 space-y-8 animate-in fade-in duration-300">
                {/* History */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {type === 'apps' ? '最近使用' : '历史搜索'}
                        </h3>
                        <button onClick={clearHistory} className="text-gray-400 hover:text-gray-600">
                            <Icon name="delete" size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {config.history.map((item, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSearch(item)}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Trending */}
                <section>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                        {type === 'apps' ? '热门功能' : '全校热搜'}
                    </h3>
                    <div className="bg-white dark:bg-[#1e2634] rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-800">
                        {config.trending.map((item, index) => (
                            <button 
                                key={index}
                                onClick={() => handleSearch(item.title)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group text-left"
                            >
                                <span className={`text-sm font-bold w-4 text-center ${index < 3 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {item.rank}
                                </span>
                                <span className="flex-1 text-sm text-slate-700 dark:text-slate-200 font-medium truncate">
                                    {item.title}
                                </span>
                                {item.hot && (
                                    <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">HOT</span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        ) : (
            <div className="p-4">
                {results.length > 0 ? (
                    <div className="space-y-3">
                        {results.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-[#1e2634] p-3 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.99] transition-transform">
                                {item.type === 'user' ? (
                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${item.color}`}>
                                        {item.avatar}
                                    </div>
                                ) : (
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${item.bg || 'bg-gray-100'}`}>
                                        <Icon name={item.icon || 'search'} className={item.color || 'text-gray-600'} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" dangerouslySetInnerHTML={{
                                            __html: item.title.replace(new RegExp(query, 'gi'), match => `<span class="text-primary">${match}</span>`)
                                        }}></h4>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                                            {item.type === 'user' ? '用户' : item.type === 'service' ? '服务' : '动态'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 truncate">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                         {isSearching && type !== 'apps' ? (
                            <span>搜索中...</span>
                         ) : (
                             <>
                                <Icon name="search_off" size={48} className="mb-2 opacity-50"/>
                                <span className="text-sm">未找到相关内容</span>
                             </>
                         )}
                    </div>
                )}
            </div>
        )}
      </div>
    </PageOverlay>
  );
};

export default SearchPage;