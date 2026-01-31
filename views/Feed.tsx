import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import Icon from '../components/Icon';
import { PostItem } from '../types';
import { getPosts } from '../api/index';

interface FeedProps {
  posts?: PostItem[]; 
  onCreatePost: () => void;
  onLike: (id: string) => void;
  onPostClick: (post: PostItem) => void;
  onCommentClick: (post: PostItem) => void;
  onShare: (id: string) => void;
  onSearch: () => void;
}

const isAvatarUrl = (avatar: string) => avatar && (avatar.startsWith('http') || avatar.includes('/'));

interface PostCardProps {
  post: PostItem;
  onPostClick: (post: PostItem) => void;
  onLike: (id: string) => void;
  onCommentClick: (post: PostItem) => void;
  onShare: (id: string) => void;
  layoutMode: 'list' | 'waterfall';
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostClick, onLike, onCommentClick, onShare, layoutMode }) => (
  <article 
      className={`bg-white dark:bg-[#1e2634] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 break-inside-avoid ${layoutMode === 'list' ? '' : 'mb-2'}`}
      onClick={() => onPostClick(post)}
  >
      {/* Header - Only for List Mode */}
      {layoutMode === 'list' && (
        <div className="p-4 flex items-center gap-3">
            {isAvatarUrl(post.user.avatar) ? (
                <img 
                src={post.user.avatar} 
                alt={post.user.name} 
                className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                />
            ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${post.user.bgColor} ${post.user.color}`}>
                {post.user.avatar}
            </div>
            )}
            <div className="flex-1">
            <h3 className="text-sm font-bold text-[#0d121b] dark:text-[#f8f9fc]">{post.user.name}</h3>
            <p className="text-xs text-[#4c669a] dark:text-[#94a3b8]">{post.time} · {post.user.role}</p>
            </div>
            <button className="text-[#4c669a]" onClick={(e) => { e.stopPropagation(); }}>
               <Icon name="more_horiz" />
            </button>
        </div>
      )}

      {/* Image Content */}
      <div className={layoutMode === 'list' ? 'px-4 pb-2' : ''}>
          {layoutMode === 'list' && (
               <p className="text-[#0d121b] dark:text-[#f8f9fc] text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
          )}

          {post.image && (
                <div 
                className={`${layoutMode === 'list' ? 'w-full h-56 rounded-lg' : 'w-full h-auto'} bg-gray-100 dark:bg-gray-800 object-cover bg-center bg-no-repeat bg-cover border border-gray-100 dark:border-gray-700`}
                style={layoutMode === 'list' ? { backgroundImage: `url("${post.image}")` } : {}}
                >
                    {layoutMode === 'waterfall' && <img src={post.image} alt="post" className="w-full h-auto object-cover block" loading="lazy" />}
                </div>
          )}
      </div>
      
      {/* Waterfall Content Body */}
      {layoutMode === 'waterfall' && (
          <div className="p-3">
            <p className="text-slate-900 dark:text-[#f8f9fc] text-sm leading-snug mb-2 line-clamp-3 break-words font-medium">
                {post.content}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
                 {isAvatarUrl(post.user.avatar) ? (
                     <img 
                       src={post.user.avatar} 
                       alt={post.user.name} 
                       className="size-5 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                     />
                  ) : (
                    <div className={`size-5 rounded-full flex items-center justify-center font-bold text-[9px] ${post.user.bgColor} ${post.user.color}`}>
                      {post.user.avatar}
                    </div>
                  )}
                 <span className="text-xs text-slate-500 dark:text-gray-400 truncate flex-1">{post.user.name}</span>
                 
                 <button 
                    onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                    className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}
                 >
                     <Icon name="favorite" size={14} filled={post.isLiked} />
                     <span className="text-[10px]">{post.stats.likes}</span>
                 </button>
            </div>
        </div>
      )}

      {/* Footer - Only for List Mode */}
      {layoutMode === 'list' && (
        <div className="flex items-center gap-6 px-4 py-3 border-t border-[#f1f4f9] dark:border-[#2d3748] mt-2">
            <button 
                onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors group ${post.isLiked ? 'text-red-500' : 'text-[#4c669a] dark:text-[#94a3b8] hover:text-red-500'}`}
            >
                <Icon name="favorite" size={20} filled={post.isLiked} className={post.isLiked ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                <span className="text-xs font-bold">{post.stats.likes}</span>
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onCommentClick(post); }}
                className="flex items-center gap-1.5 text-[#4c669a] dark:text-[#94a3b8] cursor-pointer hover:text-blue-500 transition-colors"
            >
                <Icon name="chat_bubble" size={20} />
                <span className="text-xs font-bold">{post.stats.comments}</span>
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onShare(post.id); }}
                className="flex items-center gap-1.5 text-[#4c669a] dark:text-[#94a3b8] cursor-pointer hover:text-green-500 transition-colors"
            >
                <Icon name="share" size={20} />
                <span className="text-xs font-bold">{post.stats.shares}</span>
            </button>
        </div>
      )}
  </article>
);

const Feed: React.FC<FeedProps> = ({ onCreatePost, onLike, onPostClick, onCommentClick, onShare, onSearch }) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'list' | 'waterfall'>('list');
  
  // Pull to refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);
  const isPullingRef = useRef(false);

  const REFRESH_THRESHOLD = 80;
  const MAX_PULL = 150;

  // Initial load
  useEffect(() => {
    loadData(1, true);
  }, []);

  const loadData = async (pageNum: number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
        const newPosts = await getPosts(pageNum, 10);
        if (isRefresh) {
            setPosts(newPosts);
            setHasMore(true);
        } else {
            setPosts(prev => [...prev, ...newPosts]);
        }
        
        if (newPosts.length < 10) {
            setHasMore(false);
        }
    } catch (e) {
        console.error("Failed to load feed", e);
    } finally {
        setLoading(false);
        if (isRefresh) {
            // Keep the spinner for a moment to show completion
            setTimeout(() => {
                setRefreshing(false);
                setPullY(0);
            }, 500);
        }
    }
  };

  // --- Waterfall Layout Logic ---
  const [leftCol, setLeftCol] = useState<PostItem[]>([]);
  const [rightCol, setRightCol] = useState<PostItem[]>([]);

  useEffect(() => {
    if (layoutMode === 'waterfall') {
        const left: PostItem[] = [];
        const right: PostItem[] = [];
        posts.forEach((post, index) => {
            if (index % 2 === 0) left.push(post);
            else right.push(post);
        });
        setLeftCol(left);
        setRightCol(right);
    }
  }, [posts, layoutMode]);

  // --- Pull to Refresh Handlers ---
  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
        touchStartRef.current = e.targetTouches[0].clientY;
        isPullingRef.current = true;
        setIsDragging(true);
    } else {
        isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPullingRef.current) return;
    
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStartRef.current;

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
        // Prevent default only if swipe is largely vertical to avoid blocking scroll too aggressively
        // e.preventDefault(); 
        
        // Logarithmic damping
        const damped = Math.min(diff * 0.45, MAX_PULL);
        setPullY(damped);
    } else {
        // User scrolled back up or down
        isPullingRef.current = false;
        setIsDragging(false);
        setPullY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    setIsDragging(false);

    if (pullY > REFRESH_THRESHOLD) {
        setRefreshing(true);
        setPullY(60); // Snap to loading height
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
        
        setPage(1);
        loadData(1, true);
    } else {
        setPullY(0);
    }
  };

  // --- Infinite Scroll Handler ---
  const handleScroll = () => {
    if (!containerRef.current || loading || !hasMore || refreshing) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Load more when 100px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadData(nextPage);
    }
  };

  // Internal Like Handler to update local state immediately
  const handleLocalLike = (id: string) => {
      onLike(id); // Propagate up if needed (for user profile stats etc)
      setPosts(prev => prev.map(p => {
        if (p.id === id) {
            return {
                ...p,
                isLiked: !p.isLiked,
                stats: {
                    ...p.stats,
                    likes: p.isLiked ? p.stats.likes - 1 : p.stats.likes + 1
                }
            };
        }
        return p;
      }));
  };

  // Calculate rotation based on pull distance
  const rotation = Math.min(pullY * 2.5, 360);
  const opacity = Math.min(pullY / (REFRESH_THRESHOLD / 2), 1);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md pt-safe-top border-b border-transparent">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex size-10 shrink-0 items-center justify-start">
            <button 
              onClick={onSearch}
              className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="search" className="text-slate-800 dark:text-slate-100" />
            </button>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-slate-900 dark:text-white">动态</h2>
          <div className="flex items-center justify-end gap-1">
            {/* Layout Switcher */}
            <button 
              onClick={() => setLayoutMode(prev => prev === 'list' ? 'waterfall' : 'list')}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name={layoutMode === 'list' ? 'grid_view' : 'view_agenda'} />
            </button>

            <button 
              onClick={onCreatePost}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95 shadow-md shadow-primary/20"
            >
              <Icon name="add" className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* PTR Indicator - Smoother Animation */}
      <div 
        className="absolute left-0 w-full flex items-center justify-center pointer-events-none z-30"
        style={{ 
            top: '0px', 
            height: '60px',
            transform: `translateY(${Math.max(0, pullY - 30)}px)`, 
            opacity: refreshing ? 1 : opacity,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s'
        }}
      >
        <div className={`size-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center transition-all duration-200 ${pullY > REFRESH_THRESHOLD && !refreshing ? 'scale-110 bg-primary/5' : 'scale-100'}`}>
            {refreshing ? (
                 <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
                 <Icon 
                    name="refresh" 
                    size={20} 
                    className={`text-primary transition-transform duration-0`} 
                    style={{ transform: `rotate(${rotation}deg)` }}
                 />
            )}
        </div>
      </div>

      <main 
        ref={containerRef}
        className="flex-1 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,20px)+80px)] overflow-y-auto no-scrollbar touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        style={{ 
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: `translateY(${pullY}px)`,
            willChange: 'transform' // Optimize rendering
        }}
      >
        {layoutMode === 'waterfall' ? (
             <div className="flex gap-2 items-start">
                 {/* Left Column */}
                 <div className="flex-1 min-w-0 flex flex-col gap-2">
                     {leftCol.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onPostClick={onPostClick} 
                            onLike={handleLocalLike} 
                            onCommentClick={onCommentClick}
                            onShare={onShare}
                            layoutMode="waterfall"
                        />
                     ))}
                 </div>
                 
                 {/* Right Column */}
                 <div className="flex-1 min-w-0 flex flex-col gap-2">
                     {rightCol.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onPostClick={onPostClick} 
                            onLike={handleLocalLike} 
                            onCommentClick={onCommentClick}
                            onShare={onShare}
                            layoutMode="waterfall"
                        />
                     ))}
                 </div>
             </div>
        ) : (
             <div className="flex flex-col gap-3">
                 {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onPostClick={onPostClick} 
                        onLike={handleLocalLike} 
                        onCommentClick={onCommentClick}
                        onShare={onShare}
                        layoutMode="list"
                    />
                 ))}
             </div>
        )}

        {/* Loading More Indicator */}
        <div className="h-12 flex items-center justify-center mt-2">
            {loading && !refreshing && (
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <div className="size-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    加载中...
                </div>
            )}
            {!hasMore && posts.length > 0 && (
                <span className="text-gray-300 text-xs">没有更多了</span>
            )}
            {posts.length === 0 && !loading && (
                <div className="flex flex-col items-center text-gray-400 py-10">
                     <Icon name="post_add" size={48} className="opacity-20 mb-2" />
                     <span className="text-xs">暂无动态</span>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Feed;