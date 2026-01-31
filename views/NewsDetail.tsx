import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import { NewsItem, CommentItem } from '../types';
import { getNewsComments, createNewsComment } from '../api/index';

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; parentId?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Comments state now fetched from API
  const [comments, setComments] = useState<CommentItem[]>([]);

  // Fetch comments when news id changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getNewsComments(news.id);
        if (data) {
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
  }, [news.id]);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Determine parentId: if replying to a sub-comment, use its parentId (root), otherwise use the comment id
    // If not replying, parentId is undefined.
    const parentId = replyingTo ? (replyingTo.parentId || replyingTo.id) : undefined;
    const replyToUser = replyingTo?.name;

    try {
        const newComment = await createNewsComment(news.id, inputValue, parentId, replyToUser);
        
        if (newComment) {
            if (parentId) {
              // Add as a reply (sub-comment)
              setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                  return {
                    ...c,
                    replies: [...c.replies, newComment]
                  };
                }
                return c;
              }));
            } else {
              // Add as top-level comment
              setComments(prev => [newComment, ...prev]);
              
              // Scroll to bottom
              if (scrollRef.current) {
                // Wait for render
                setTimeout(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }, 100);
              }
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

  const handleReplyClick = (comment: CommentItem, parentId?: string) => {
    setReplyingTo({
      id: comment.id,
      name: comment.user.name,
      parentId: parentId 
    });
  };

  const handleLike = (commentId: string, parentId?: string) => {
    setComments(prev => prev.map(c => {
      // If it's the main comment
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      // If it's a reply inside a parent
      if (parentId && c.id === parentId) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r)
        };
      }
      return c;
    }));
  };

  const isAvatarUrl = (avatar: string) => avatar && (avatar.startsWith('http') || avatar.includes('/'));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background-dark animate-in slide-in-from-right duration-200 absolute inset-0 z-[60] overflow-hidden">
      {/* Detail Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-2 py-2 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="arrow_back" className="text-slate-800 dark:text-slate-100" />
        </button>
        <h2 className="text-base font-bold flex-1 text-center pr-10 text-slate-900 dark:text-white">公告详情</h2>
      </header>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20" ref={scrollRef}>
        {/* Article Section */}
        <div>
          <div 
            className="w-full h-48 bg-cover bg-center"
            style={{ backgroundImage: `url("${news.image}")` }}
          ></div>
          
          <div className="px-5 py-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                news.tagColor === 'primary' ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-100 dark:bg-red-900/30'
              }`}>
                {news.tag}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{news.date}</span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug mb-6">
              {news.title}
            </h1>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              {news.content.split('\n').map((paragraph, index) => (
                <p key={index} className={`text-slate-600 dark:text-gray-300 leading-relaxed mb-4 ${paragraph.trim() === '' ? 'h-2' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400">阅读 2388</span>
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                   <Icon name="thumb_up" size={18} />
                   <span className="text-xs">点赞</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                   <Icon name="share" size={18} />
                   <span className="text-xs">分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-2 bg-gray-50 dark:bg-gray-900"></div>

        {/* Comments Section */}
        <div className="px-5 py-6">
           <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">全部评论 ({comments.reduce((acc, curr) => acc + 1 + curr.replies.length, 0)})</h3>
           
           <div className="space-y-6">
             {comments.map((comment) => (
               <div key={comment.id} className="flex gap-3">
                 {/* Avatar */}
                 {isAvatarUrl(comment.user.avatar) ? (
                    <img src={comment.user.avatar} alt={comment.user.name} className="shrink-0 size-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                 ) : (
                    <div className={`shrink-0 size-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.user.bgColor}`}>
                      {comment.user.avatar}
                    </div>
                 )}
                 
                 {/* Content */}
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{comment.user.name}</span>
                     <button 
                       onClick={() => handleLike(comment.id)}
                       className="flex items-center gap-1 text-gray-400 hover:text-red-500"
                       disabled={isSubmitting}
                     >
                       <Icon name="favorite" size={14} filled={comment.likes > 0} className={comment.likes > 0 ? 'text-red-500' : ''} />
                       <span className="text-xs">{comment.likes || ''}</span>
                     </button>
                   </div>
                   
                   <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 leading-relaxed">
                     {comment.content}
                   </p>
                   
                   <div className="flex items-center gap-4 mt-2">
                     <span className="text-xs text-gray-400">{comment.time}</span>
                     <button 
                       onClick={() => handleReplyClick(comment)}
                       className="text-xs font-medium text-slate-500 hover:text-primary"
                     >
                       回复
                     </button>
                   </div>

                   {/* Threaded Replies (楼中楼) */}
                   {comment.replies.length > 0 && (
                     <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                       {comment.replies.map((reply) => (
                         <div key={reply.id} className="flex gap-2">
                            {isAvatarUrl(reply.user.avatar) ? (
                                <img src={reply.user.avatar} alt={reply.user.name} className="shrink-0 size-6 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                            ) : (
                                <div className={`shrink-0 size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${reply.user.bgColor}`}>
                                  {reply.user.avatar}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{reply.user.name}</span>
                                {reply.replyToUser && (
                                  <>
                                    <span className="text-xs text-gray-400">回复</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{reply.replyToUser}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] text-gray-400">{reply.time}</span>
                                <div className="flex gap-3 ml-auto">
                                    <button 
                                      onClick={() => handleReplyClick(reply, comment.id)}
                                      className="text-[10px] font-medium text-slate-500 hover:text-primary"
                                    >
                                      回复
                                    </button>
                                    <button 
                                      onClick={() => handleLike(reply.id, comment.id)}
                                      className="flex items-center gap-0.5 text-gray-400 hover:text-red-500"
                                      disabled={isSubmitting}
                                    >
                                      <Icon name="favorite" size={12} filled={reply.likes > 0} className={reply.likes > 0 ? 'text-red-500' : ''} />
                                      {reply.likes > 0 && <span className="text-[10px]">{reply.likes}</span>}
                                    </button>
                                </div>
                              </div>
                            </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Comment Input Footer */}
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
            className="shrink-0 flex items-center justify-center size-9 rounded-full bg-primary text-white disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 transition-colors"
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

export default NewsDetail;