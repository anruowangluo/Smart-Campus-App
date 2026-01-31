import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import { PostItem, CommentItem } from '../types';
import { getPostComments, createPostComment } from '../api/index';

interface PostDetailProps {
  post: PostItem;
  onBack: () => void;
  onLikePost: (id: string) => void;
  initialScrollToComments?: boolean;
}

type SortType = 'latest' | 'hottest';

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onLikePost, initialScrollToComments = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [sortType, setSortType] = useState<SortType>('latest');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; parentId?: string } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  // Comments state now fetched from API
  const [comments, setComments] = useState<CommentItem[]>([]);

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getPostComments(post.id);
        if (data) {
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch post comments", error);
      }
    };
    fetchComments();
  }, [post.id]);

  // Sorting Logic
  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortType === 'hottest') {
      return list.sort((a, b) => b.likes - a.likes);
    } else {
      // Simple string comparison for demo, ideally parse Date
      return list.sort((a, b) => b.time.localeCompare(a.time));
    }
  }, [comments, sortType]);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // Handle auto-scroll to comments
  useLayoutEffect(() => {
    if (initialScrollToComments && comments.length > 0) {
      if (commentsSectionRef.current && scrollRef.current) {
        scrollRef.current.scrollTop = commentsSectionRef.current.offsetTop;
      }
    }
  }, [initialScrollToComments, comments.length]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const parentId = replyingTo ? (replyingTo.parentId || replyingTo.id) : undefined;
    const replyToUser = replyingTo?.name;

    try {
        const newComment = await createPostComment(post.id, inputValue, parentId, replyToUser);

        if (newComment) {
            if (parentId) {
              setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                  return { ...c, replies: [...c.replies, newComment] };
                }
                return c;
              }));
            } else {
              setComments(prev => [newComment, ...prev]);
            }
            setInputValue('');
            setReplyingTo(null);
        }
    } catch (e) {
        console.error("Failed to post comment", e);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string, parentId?: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) return { ...c, likes: c.likes + 1 };
      if (parentId && c.id === parentId) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r)
        };
      }
      return c;
    }));
  };

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      onBack();
    }, 300);
  };

  const isAvatarUrl = (avatar: string) => avatar && (avatar.startsWith('http') || avatar.includes('/'));

  return (
    <div className={`flex flex-col h-full bg-background-light dark:bg-background-dark absolute inset-0 z-[60] shadow-2xl ${
      isClosing 
        ? 'animate-slide-out-right' 
        : 'animate-slide-in-right'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-2 py-2 border-b border-gray-200/50 dark:border-gray-800/50">
        <button 
          onClick={handleBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="arrow_back" className="text-slate-800 dark:text-slate-100" />
        </button>
        <h2 className="text-base font-bold flex-1 text-center pr-10 text-slate-900 dark:text-white">动态详情</h2>
      </header>

      {/* Main Content Area - Use flex-col to ensure background fill */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col" ref={scrollRef}>
        {/* Post Content */}
        <div className="shrink-0 bg-white dark:bg-[#1e2634] mb-2 shadow-sm border-b border-gray-100 dark:border-gray-800">
          <div className="p-4 flex items-center gap-3">
            {isAvatarUrl(post.user.avatar) ? (
                <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
            ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${post.user.bgColor} ${post.user.color}`}>
                  {post.user.avatar}
                </div>
            )}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{post.user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">{post.time} · {post.user.role}</p>
            </div>
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${post.isLiked ? 'text-red-500 border-red-500 bg-red-50 dark:bg-red-900/20' : 'text-primary border-primary bg-primary/5'}`}
              onClick={() => onLikePost(post.id)}
            >
              {post.isLiked ? '已赞' : '+ 关注'}
            </button>
          </div>
          
          <div className="px-4 pb-4">
            <p className="text-slate-900 dark:text-white text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <div 
                className="w-full h-64 bg-center bg-no-repeat bg-cover rounded-xl border border-gray-100 dark:border-gray-700"
                style={{ backgroundImage: `url("${post.image}")` }}
              ></div>
            )}
          </div>
          
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50 dark:border-gray-800">
             <div className="flex gap-6">
                <span className="text-xs text-gray-500">阅读 1.2w</span>
             </div>
             <div className="flex gap-4">
               <button 
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
               >
                 <Icon name="favorite" size={20} filled={post.isLiked} />
                 <span className="text-xs font-bold">{post.stats.likes}</span>
               </button>
               <button className="flex items-center gap-1 text-gray-500">
                 <Icon name="share" size={20} />
                 <span className="text-xs font-bold">{post.stats.shares}</span>
               </button>
             </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div 
          ref={commentsSectionRef}
          className="shrink-0 bg-white dark:bg-[#1e2634] px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-40"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">评论 ({comments.reduce((acc, curr) => acc + 1 + curr.replies.length, 0)})</h3>
          <div className="flex gap-4 text-xs">
            <button 
              onClick={() => setSortType('latest')}
              className={`font-medium transition-colors ${sortType === 'latest' ? 'text-primary' : 'text-gray-400'}`}
            >
              最新
            </button>
            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700 my-auto"></div>
            <button 
              onClick={() => setSortType('hottest')}
              className={`font-medium transition-colors ${sortType === 'hottest' ? 'text-primary' : 'text-gray-400'}`}
            >
              最热
            </button>
          </div>
        </div>

        {/* Comment List - Flex-1 ensures it fills remaining space with white bg */}
        <div className="flex-1 bg-white dark:bg-[#1e2634] px-4 py-2 pb-20">
           {sortedComments.length === 0 ? (
             <div className="py-10 text-center text-gray-400 text-xs">
               暂无评论，快来抢沙发吧~
             </div>
           ) : (
             sortedComments.map((comment) => (
               <div key={comment.id} className="py-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                 <div className="flex gap-3">
                   {isAvatarUrl(comment.user.avatar) ? (
                      <img src={comment.user.avatar} alt={comment.user.name} className="shrink-0 size-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                   ) : (
                      <div className={`shrink-0 size-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.user.bgColor}`}>
                        {comment.user.avatar}
                      </div>
                   )}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{comment.user.name}</span>
                       <button 
                         onClick={() => handleLikeComment(comment.id)}
                         className="flex items-center gap-1 text-gray-400 hover:text-red-500"
                         disabled={isSubmitting}
                       >
                         <Icon name="favorite" size={12} filled={comment.likes > 0} className={comment.likes > 0 ? 'text-red-500' : ''} />
                         <span className="text-xs">{comment.likes || ''}</span>
                       </button>
                     </div>
                     <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 leading-relaxed">{comment.content}</p>
                     <div className="flex items-center gap-4 mt-2">
                       <span className="text-xs text-gray-400">{comment.time}</span>
                       <button 
                         onClick={() => setReplyingTo({ id: comment.id, name: comment.user.name })}
                         className="text-xs font-medium text-slate-500 hover:text-primary"
                       >
                         回复
                       </button>
                     </div>
                     
                     {/* Replies */}
                     {comment.replies.length > 0 && (
                       <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                         {comment.replies.map(reply => (
                           <div key={reply.id} className="flex gap-2">
                             {isAvatarUrl(reply.user.avatar) ? (
                                <img src={reply.user.avatar} alt={reply.user.name} className="shrink-0 size-5 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                             ) : (
                                <div className={`shrink-0 size-5 rounded-full flex items-center justify-center text-[9px] font-bold ${reply.user.bgColor}`}>
                                  {reply.user.avatar}
                                </div>
                             )}
                             <div className="flex-1">
                               <div className="flex items-center gap-1">
                                 <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{reply.user.name}</span>
                                 {reply.replyToUser && <span className="text-xs text-gray-400">回复 {reply.replyToUser}</span>}
                               </div>
                               <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{reply.content}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Footer Input */}
      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[#1e2634] border-t border-gray-100 dark:border-gray-800 pb-safe-bottom z-50">
        {replyingTo && (
           <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500">
             <span>回复 <span className="font-bold text-primary">@{replyingTo.name}</span></span>
             <button onClick={() => setReplyingTo(null)} className="p-1">
               <Icon name="close" size={16} />
             </button>
           </div>
        )}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center">
             <input 
               ref={inputRef}
               type="text" 
               className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:text-gray-400 text-slate-900 dark:text-white"
               placeholder={replyingTo ? "写下你的回复..." : "说点什么..."}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               disabled={isSubmitting}
             />
          </div>
          <button 
            disabled={!inputValue.trim() || isSubmitting}
            onClick={handleSend}
            className="shrink-0 flex items-center justify-center size-9 rounded-full bg-primary text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            {isSubmitting ? (
                 <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <Icon name="send" size={18} className="translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;