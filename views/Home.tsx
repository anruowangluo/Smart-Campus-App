import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { ServiceItem, NewsItem, UserProfile } from '../types';
import { getNews, getUserProfile } from '../api/index';

interface HomeProps {
  commonServices: ServiceItem[];
  onNavigateToApps: () => void;
  onNewsClick: (news: NewsItem) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

const Home: React.FC<HomeProps> = ({ commonServices, onNavigateToApps, onNewsClick, onOpenNotifications, unreadCount }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, userData] = await Promise.all([
          getNews(),
          getUserProfile()
        ]);
        
        if (Array.isArray(newsData)) setNews(newsData);
        if (userData) setUser(userData);
        
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md pt-safe-top border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="size-10"></div>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-slate-900 dark:text-white">首页</h2>
          <div className="flex w-10 items-center justify-end">
            <button 
              onClick={onOpenNotifications}
              className="relative flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="notifications" className="text-slate-800 dark:text-slate-100" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-background-dark"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Adjusted bottom padding to 80px */}
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-[calc(env(safe-area-inset-bottom,20px)+80px)] no-scrollbar overscroll-y-none">
        
        {/* Student ID Card */}
        <div className="relative overflow-hidden rounded-xl bg-primary p-4 text-white shadow-xl shadow-primary/20 mb-6 min-h-[140px]">
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border border-white/30 backdrop-blur-md">Student</span>
          </div>

          {user ? (
            <div className="relative z-10 flex gap-3 items-center">
              <div className="shrink-0">
                <div 
                  className="h-14 w-11 rounded-lg bg-white/20 border-2 border-white/30 bg-center bg-no-repeat bg-cover shadow-sm"
                  style={{ backgroundImage: `url("${user.avatar}")` }}
                ></div>
              </div>
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h3 className="text-lg font-bold tracking-wide">{user.name}</h3>
                <p className="text-xs font-medium text-white/90 truncate mt-0.5">{user.department}</p>
                <div className="mt-0.5">
                  <p className="text-[10px] text-white/80 font-mono tracking-tight">学号: {user.studentId}</p>
                </div>
              </div>
            </div>
          ) : (
            // Skeleton for User Card
            <div className="relative z-10 flex gap-3 items-center animate-pulse">
               <div className="h-14 w-11 rounded-lg bg-white/20"></div>
               <div className="flex-1 space-y-2">
                 <div className="h-5 bg-white/20 rounded w-1/3"></div>
                 <div className="h-3 bg-white/20 rounded w-1/2"></div>
               </div>
            </div>
          )}
          
          <div className="absolute -bottom-4 -right-2 opacity-10 pointer-events-none">
            <Icon name="school" size={80} />
          </div>
        </div>

        {/* Common Services */}
        <section className="mb-8">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">常用服务</h3>
            <button 
              onClick={onNavigateToApps}
              className="text-primary text-sm font-medium"
            >
              全部
            </button>
          </div>
          {loading && commonServices.length === 0 ? (
             <div className="grid grid-cols-4 gap-y-6 animate-pulse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="size-12 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
                    <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-4 gap-y-6">
              {commonServices.map((service) => (
                <div key={service.id} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.bgColor} dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 group-active:bg-primary/5`}>
                    <Icon name={service.icon} className={`${service.color} text-2xl`} />
                  </div>
                  <p className="text-slate-800 dark:text-gray-300 text-xs font-medium">{service.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Announcements */}
        <section>
          <h3 className="text-lg font-bold pb-3 text-slate-900 dark:text-white">校园公告</h3>
          <div className="space-y-3">
            {loading && news.length === 0 ? (
               [1,2].map(i => (
                 <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
               ))
            ) : (
              news.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onNewsClick(item)}
                  className="flex items-start gap-4 rounded-xl bg-white dark:bg-gray-900 p-3 border border-gray-100 dark:border-gray-800 shadow-sm active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight text-slate-900 dark:text-gray-100 line-clamp-2">{item.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.tagColor === 'primary' ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {item.tag}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                  <div 
                    className="shrink-0 h-16 w-16 rounded-lg bg-gray-100 bg-cover bg-center border border-gray-100 dark:border-gray-700"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  ></div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;