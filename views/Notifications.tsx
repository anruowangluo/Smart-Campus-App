import React, { useState } from 'react';
import Icon from '../components/Icon';
import { NotificationItem } from '../types';

interface NotificationsProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onMarkAllRead: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onBack, onMarkAllRead }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'academic': return { icon: 'school', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'activity': return { icon: 'event', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
      case 'system': return { icon: 'notifications', color: 'text-primary', bg: 'bg-primary/10' };
      default: return { icon: 'info', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const handleMarkClick = () => {
    // Only show confirm if there are unread messages
    if (notifications.some(n => !n.isRead)) {
      setShowConfirm(true);
    }
  };

  const confirmMarkRead = () => {
    onMarkAllRead();
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-200 absolute inset-0 z-[60]">
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-2 py-2 border-b border-gray-200/50 dark:border-gray-800/50">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="arrow_back" className="text-slate-800 dark:text-slate-100" />
        </button>
        <h2 className="text-base font-bold flex-1 text-center text-slate-900 dark:text-white">消息通知</h2>
        <button 
          onClick={handleMarkClick}
          className={`flex size-10 items-center justify-center rounded-full transition-colors ${notifications.some(n => !n.isRead) ? 'text-primary hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-300 cursor-not-allowed'}`}
          title="全部已读"
          disabled={!notifications.some(n => !n.isRead)}
        >
          <Icon name="done_all" size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Icon name="notifications_off" size={48} className="mb-2 opacity-50" />
            <p className="text-sm">暂无新消息</p>
          </div>
        ) : (
          notifications.map((item) => {
            const style = getNotificationIcon(item.type);
            return (
              <div key={item.id} className={`bg-white dark:bg-gray-900 p-4 rounded-xl border ${item.isRead ? 'border-gray-100 dark:border-gray-800 opacity-70' : 'border-gray-200 dark:border-gray-700 shadow-sm'} transition-all`}>
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${style.bg}`}>
                    <Icon name={style.icon} className={style.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${item.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.title}
                      </h4>
                      {!item.isRead && <span className="size-2 rounded-full bg-red-500"></span>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mb-2">
                      {item.content}
                    </p>
                    <span className="text-[10px] text-gray-400 block">{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xs p-6 border border-gray-100 dark:border-gray-700 transform scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Icon name="checklist" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">确认全部已读?</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                将把列表中的所有未读消息标记为已读状态。
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="py-2.5 px-4 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmMarkRead}
                  className="py-2.5 px-4 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-all"
                >
                  确认已读
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;