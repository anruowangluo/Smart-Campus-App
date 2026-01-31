import React, { useState } from 'react';
import Icon from '../components/Icon';

interface CreatePostProps {
  onBack: () => void;
  onSubmit: (content: string, image?: string) => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onBack, onSubmit }) => {
  const [content, setContent] = useState('');
  // Mock image state - in a real app this would be a file upload
  const [hasImage, setHasImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    // Mock an image if selected, otherwise undefined
    const image = hasImage ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTDWyio-3fWUNRBObJVvCKO7BTLkuhe38Ici3iHt9EIULd6Q4wYAJse43yrKd-IeGJoQqrppLEfmkaTGiHGDZuaCwrF3hAvYTC-spzlBa6N2Y2LLZqFetuyygaNjd5W30tTNgaFZ-9DiZkwgsVR_kHKck90Q9P_L5hGEz285_WtOD1imsRNKEOKCJLmXtfnCqn5wvcGgUbnFB2tdMs0p9tQxbtpD3BzlQ35tTIbX2A3Kc586CGNfvoHjwGu-gnDm7krGpLBKdpkJKq' : undefined;
    
    try {
        await onSubmit(content, image);
        // Note: onSubmit in App.tsx closes this modal, so we might unmount here.
    } catch (e) {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background-dark animate-in slide-in-from-bottom duration-300 absolute inset-0 z-[60]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="text-slate-600 dark:text-slate-300 font-medium disabled:opacity-50"
        >
          取消
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">发布动态</h2>
        <button 
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
        >
          {isSubmitting && <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {isSubmitting ? '发布中' : '发布'}
        </button>
      </header>

      {/* Input Area */}
      <div className="flex-1 p-4 flex flex-col">
        <textarea
          className="w-full flex-1 bg-transparent border-none resize-none focus:ring-0 text-base placeholder:text-gray-400 text-slate-900 dark:text-white p-0"
          placeholder="分享你的新鲜事..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          disabled={isSubmitting}
        ></textarea>

        {/* Image Preview (Mock) */}
        {hasImage && (
          <div className="mt-4 relative inline-block w-32 h-32 rounded-xl overflow-hidden group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTDWyio-3fWUNRBObJVvCKO7BTLkuhe38Ici3iHt9EIULd6Q4wYAJse43yrKd-IeGJoQqrppLEfmkaTGiHGDZuaCwrF3hAvYTC-spzlBa6N2Y2LLZqFetuyygaNjd5W30tTNgaFZ-9DiZkwgsVR_kHKck90Q9P_L5hGEz285_WtOD1imsRNKEOKCJLmXtfnCqn5wvcGgUbnFB2tdMs0p9tQxbtpD3BzlQ35tTIbX2A3Kc586CGNfvoHjwGu-gnDm7krGpLBKdpkJKq" 
              alt="Selected" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setHasImage(false)}
              disabled={isSubmitting}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 disabled:opacity-0"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 pb-safe-bottom">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setHasImage(!hasImage)}
            disabled={isSubmitting}
            className={`flex flex-col items-center gap-1 disabled:opacity-50 ${hasImage ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <div className={`size-12 rounded-2xl flex items-center justify-center ${hasImage ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Icon name="image" size={24} />
            </div>
            <span className="text-xs font-medium">图片</span>
          </button>
          
          <button disabled={isSubmitting} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 disabled:opacity-50">
            <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="alternate_email" size={24} />
            </div>
            <span className="text-xs font-medium">提醒</span>
          </button>

          <button disabled={isSubmitting} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 disabled:opacity-50">
            <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="tag" size={24} />
            </div>
            <span className="text-xs font-medium">话题</span>
          </button>

          <button disabled={isSubmitting} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 disabled:opacity-50">
            <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="mood" size={24} />
            </div>
            <span className="text-xs font-medium">表情</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;