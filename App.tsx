import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import Home from './views/Home';
import Apps from './views/Apps';
import Feed from './views/Feed';
import Profile from './views/Profile';
import NewsDetail from './views/NewsDetail';
import Notifications from './views/Notifications';
import CreatePost from './views/CreatePost';
import PostDetail from './views/PostDetail';
import SearchPage from './views/SearchPage';
import Login from './views/Login';
import { AppTab, NewsItem, NotificationItem, PostItem, ServiceItem } from './types';
import { createPost, getCommonServices } from './api/index';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('smart_campus_token');
  });

  // Initialize state from localStorage if available, otherwise default to HOME
  const [currentTab, setCurrentTab] = useState<AppTab>(() => {
    try {
      const savedTab = localStorage.getItem('smart_campus_active_tab');
      // Validate if the saved string matches a valid enum value
      if (savedTab && Object.values(AppTab).includes(savedTab as AppTab)) {
        return savedTab as AppTab;
      }
    } catch (e) {
      console.warn('Failed to read tab state from storage', e);
    }
    return AppTab.HOME;
  });

  // Keep track of which tabs have been visited at least once
  // This enables "Lazy Load + Keep Alive"
  const [visitedTabs, setVisitedTabs] = useState<Set<AppTab>>(() => new Set([currentTab]));

  // Persist tab state whenever it changes and update visited list
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('smart_campus_active_tab', currentTab);
    setVisitedTabs(prev => {
      if (prev.has(currentTab)) return prev;
      const next = new Set(prev);
      next.add(currentTab);
      return next;
    });
  }, [currentTab, isAuthenticated]);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Update state to hold post item and navigation intent
  const [selectedPostState, setSelectedPostState] = useState<{ post: PostItem; scrollToComments: boolean } | null>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Replaced simple boolean with string to track search context ('apps' | 'global')
  const [searchMode, setSearchMode] = useState<'global' | 'apps' | null>(null);

  // --- Common Services State Management (Lifted from Home) ---
  const [commonServices, setCommonServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Try to load from local storage first to persist user edits
    const savedServices = localStorage.getItem('smart_campus_my_services');
    if (savedServices) {
      try {
        setCommonServices(JSON.parse(savedServices));
      } catch (e) {
        console.error("Failed to parse saved services", e);
        loadDefaultCommonServices();
      }
    } else {
      loadDefaultCommonServices();
    }
  }, [isAuthenticated]);

  const loadDefaultCommonServices = () => {
    getCommonServices().then(data => {
      setCommonServices(data);
      localStorage.setItem('smart_campus_my_services', JSON.stringify(data));
    }).catch(err => console.error("Failed to load common services", err));
  };

  const handleUpdateCommonServices = (newServices: ServiceItem[]) => {
    setCommonServices(newServices);
    localStorage.setItem('smart_campus_my_services', JSON.stringify(newServices));
  };

  // --- Notification Data ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
      id: '1', 
      title: '课程调整通知', 
      content: '您的《高等数学》课程因教室维修，本周五调整至教三-201进行。', 
      time: '10分钟前', 
      type: 'academic', 
      isRead: false 
    },
    { 
      id: '2', 
      title: '图书即将到期提醒', 
      content: '您借阅的《算法导论》将于3天后到期，请及时归还或登录系统续借。', 
      time: '2小时前', 
      type: 'system', 
      isRead: false 
    },
    { 
      id: '3', 
      title: '社团招新活动', 
      content: '吉他社、摄影社等百团大战将于本周末在北操场举行，期待你的加入！', 
      time: '昨天', 
      type: 'activity', 
      isRead: true 
    },
    { 
      id: '4', 
      title: '系统维护公告', 
      content: '校园网将于今晚 00:00-04:00 进行例行维护，届时网络可能中断。', 
      time: '2天前', 
      type: 'system', 
      isRead: true 
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // --- Post Creation ---
  // Note: Since Feed now manages its own list for pagination, creating a post here won't instantly update the feed list
  // unless we pass a trigger. For this demo, we assume the user will pull-to-refresh after posting.
  const handleCreatePost = async (content: string, image?: string) => {
    await createPost(content, image);
    setShowCreatePost(false);
  };

  // Like logic for Detail view
  const handlePostLike = (id: string) => {
    // This is primarily for the PostDetail view now or global state sync if we added Context
    console.log("Liked post", id);
  };

  const handlePostShare = (id: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Smart Campus Feed',
        text: 'Check out this post!',
        url: `https://example.com/post/${id}`
      }).catch((error) => {
        console.warn("Share failed or cancelled:", error);
      });
    }
  };

  // --- Login / Logout Handlers ---
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setVisitedTabs(new Set([AppTab.HOME]));
    setCurrentTab(AppTab.HOME);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_campus_token');
    setIsAuthenticated(false);
    setVisitedTabs(new Set());
    setCurrentTab(AppTab.HOME);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full bg-background-light dark:bg-background-dark max-w-md mx-auto relative shadow-2xl overflow-hidden">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="h-full bg-background-light dark:bg-background-dark max-w-md mx-auto relative shadow-2xl overflow-hidden animate-in fade-in duration-500">
      
      {/* Main Layer - Lazy Load + Keep Alive Implementation */}
      {/* We check if the tab is in 'visitedTabs'. If yes, render it (either hidden or visible). If no, don't render DOM at all. */}
      
      {visitedTabs.has(AppTab.HOME) && (
        <div className={`h-full w-full ${currentTab === AppTab.HOME ? 'block' : 'hidden'}`}>
            <Home 
              commonServices={commonServices}
              onNavigateToApps={() => setCurrentTab(AppTab.APPS)} 
              onNewsClick={(news) => setSelectedNews(news)}
              onOpenNotifications={() => setShowNotifications(true)}
              unreadCount={unreadCount}
            />
        </div>
      )}

      {visitedTabs.has(AppTab.APPS) && (
        <div className={`h-full w-full ${currentTab === AppTab.APPS ? 'block' : 'hidden'}`}>
            <Apps 
                onSearch={() => setSearchMode('apps')} 
                myServices={commonServices}
                onUpdateMyServices={handleUpdateCommonServices}
            />
        </div>
      )}

      {visitedTabs.has(AppTab.FEED) && (
        <div className={`h-full w-full ${currentTab === AppTab.FEED ? 'block' : 'hidden'}`}>
            <Feed 
              onCreatePost={() => setShowCreatePost(true)}
              onLike={handlePostLike}
              onPostClick={(post) => setSelectedPostState({ post, scrollToComments: false })}
              onCommentClick={(post) => setSelectedPostState({ post, scrollToComments: true })}
              onShare={handlePostShare}
              onSearch={() => setSearchMode('global')}
            />
        </div>
      )}

      {visitedTabs.has(AppTab.PROFILE) && (
        <div className={`h-full w-full ${currentTab === AppTab.PROFILE ? 'block' : 'hidden'}`}>
            <Profile onLogout={handleLogout} />
        </div>
      )}

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Overlay Layer - Post Detail */}
      {selectedPostState && (
        <PostDetail 
          post={selectedPostState.post} 
          onBack={() => setSelectedPostState(null)}
          onLikePost={handlePostLike}
          initialScrollToComments={selectedPostState.scrollToComments}
        />
      )}

      {/* Overlay Layer - News Detail */}
      {selectedNews && (
        <NewsDetail news={selectedNews} onBack={() => setSelectedNews(null)} />
      )}

      {/* Overlay Layer - Notifications */}
      {showNotifications && (
         <Notifications 
            notifications={notifications} 
            onBack={() => setShowNotifications(false)} 
            onMarkAllRead={handleMarkAllRead}
         />
      )}

      {/* Overlay Layer - Global Search (Configured based on mode) */}
      {searchMode && (
        <SearchPage 
            type={searchMode} 
            onBack={() => setSearchMode(null)} 
        />
      )}

      {/* Overlay Layer - Create Post */}
      {showCreatePost && (
        <CreatePost 
          onBack={() => setShowCreatePost(false)} 
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default App;