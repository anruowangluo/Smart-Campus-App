import React, { useState } from 'react';
import Icon from '../components/Icon';

interface ProfileProps {
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Threshold: roughly when the main avatar starts to be obscured
    if (scrollTop > 60 && !showStickyHeader) {
      setShowStickyHeader(true);
    } else if (scrollTop <= 60 && showStickyHeader) {
      setShowStickyHeader(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    if (onLogout) onLogout();
    setShowLogoutConfirm(false);
  };

  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD1qCTLKrEcwJ40Nleob7klo_jbe1nj5-R7vT_gQev2w5bGj_znZK1ohg71EvuuI1hMnbWfX-cFyGc9avx4AL6qRmIUDsVFRwH3PtLV1a8J2Ch6vlp5Pd2JfQ6P1SzmS54E5GGcdt4MVJWiuV7kio-71BZUqSOF8SAsI0OQVxXFauQKXIuUZKsFZ3n4cdS64D4DlgXeyh3G3y8j_Zk89ZJYvHfPUJYIUDl3-mi7Xj5V6FC_k47uphpgd_ARxYic0LTDC2JNHNVecT0V";

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-all duration-300">
        <div className="relative flex items-center justify-between px-4 py-3 h-[52px]">
          
          {/* Left: Sticky Profile Info (Fade In) */}
          <div className={`flex items-center gap-3 ml-4 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${showStickyHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
             <div 
               className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 shadow-sm"
               style={{ backgroundImage: `url("${avatarUrl}")` }}
             ></div>
             <span className="font-bold text-sm text-slate-900 dark:text-white">张三</span>
          </div>

          {/* Center: Page Title (Fade Out) */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${showStickyHeader ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
             <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">我的</h1>
          </div>

          {/* Right: Settings */}
          <div className="flex items-center justify-end z-10">
            <button className="text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full transition-colors -mr-2">
               <Icon name="settings" />
            </button>
          </div>
        </div>
      </header>

      <main 
        className="flex-1 overflow-y-auto no-scrollbar pb-[calc(env(safe-area-inset-bottom,20px)+60px)] scroll-smooth overscroll-y-none"
        onScroll={handleScroll}
      >
        {/* Profile Info */}
        <section className="px-4 py-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div 
                className="size-20 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm"
                style={{ backgroundImage: `url("${avatarUrl}")` }}
              ></div>
              <div className="absolute bottom-0 right-0 size-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">张三</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">计算机科学与技术学院</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 tracking-wider uppercase">学号: 2023010123</p>
            </div>
          </div>
        </section>

        {/* Menu Group 1 */}
        <div className="px-4 mt-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 group">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="person" size={22} />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">个人信息</span>
              </div>
              <Icon name="chevron_right" className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="verified_user" size={22} />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">账号安全</span>
              </div>
              <Icon name="chevron_right" className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Menu Group 2 */}
        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="lock" size={22} />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">隐私设置</span>
              </div>
              <Icon name="chevron_right" className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                   <Icon name="support_agent" size={22} />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">帮助与反馈</span>
              </div>
              <Icon name="chevron_right" className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                   <Icon name="info" size={22} />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">关于我们</span>
              </div>
              <Icon name="chevron_right" className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mt-10">
          <button 
            onClick={handleLogoutClick}
            className="w-full py-4 bg-white dark:bg-slate-900 text-red-500 font-bold rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            退出登录
          </button>
          <p className="text-center text-slate-400 text-xs mt-6 mb-10">Version 2.4.0 (Build 2024)</p>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xs p-6 border border-gray-100 dark:border-gray-700 transform scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-500">
                <Icon name="logout" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">确认退出登录?</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 leading-relaxed">
                退出后将无法接收消息通知，且需要重新验证身份才能登录。
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-3 px-4 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-100 dark:bg-gray-800"
                >
                  取消
                </button>
                <button 
                  onClick={confirmLogout}
                  className="py-3 px-4 rounded-xl font-medium bg-red-500 text-white shadow-lg shadow-red-500/30 active:scale-95 transition-all hover:bg-red-600"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;