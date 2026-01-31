import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { login, getCaptchaImage } from '../api';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(''); // Captcha code input
  const [uuid, setUuid] = useState(''); // Captcha uuid
  const [captchaImg, setCaptchaImg] = useState(''); // Base64 image
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Captcha on mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await getCaptchaImage();
      setCaptchaEnabled(res.captchaEnabled === undefined ? true : res.captchaEnabled);
      if (res.img) {
          setCaptchaImg(`data:image/png;base64,${res.img}`);
      }
      if (res.uuid) {
          setUuid(res.uuid);
      }
    } catch (e) {
      console.warn("Failed to fetch captcha", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    if (captchaEnabled && !code) {
        setError('请输入验证码');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { token } = await login(username, password, code, uuid);
      localStorage.setItem('smart_campus_token', token);
      
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
      
    } catch (err: any) {
      setError(err.message || '登录失败，请检查账号密码');
      setIsLoading(false);
      // Refresh captcha on failure
      if (captchaEnabled) {
          fetchCaptcha();
          setCode('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background-dark relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[45%] bg-primary rounded-b-[3rem] shadow-xl z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-8 pt-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-8 duration-700">
           <div className="size-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
              <Icon name="school" size={48} className="text-primary" />
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">智慧校园</h1>
           <p className="text-blue-100 mt-2 text-sm tracking-wide font-medium">Smart Campus App</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 -mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">账号登录</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-1">
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon name="person" size={20} />
                   </div>
                   <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="账号"
                   />
                </div>
             </div>

             <div className="space-y-1">
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon name="lock" size={20} />
                   </div>
                   <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="密码"
                   />
                </div>
             </div>

             {/* Captcha Input */}
             {captchaEnabled && (
                 <div className="flex gap-3">
                    <div className="relative flex-1">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Icon name="verified_user" size={20} />
                       </div>
                       <input 
                          type="text" 
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="验证码"
                       />
                    </div>
                    <div 
                        className="w-28 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                        onClick={fetchCaptcha}
                        title="点击刷新"
                    >
                        {captchaImg ? (
                            <img src={captchaImg} alt="验证码" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">加载中...</span>
                        )}
                    </div>
                 </div>
             )}
             
             {error && (
                <div className="text-red-500 text-xs text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                   {error}
                </div>
             )}

             <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
             >
                {isLoading ? (
                   <>
                     <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     登录中...
                   </>
                ) : '登 录'}
             </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-1 flex flex-col justify-end pb-8 items-center space-y-4">
           <button className="text-slate-400 text-xs hover:text-primary transition-colors">
              忘记密码?
           </button>
           <p className="text-[10px] text-slate-300 dark:text-slate-600">
              © 2024 Smart Campus. All rights reserved.
           </p>
        </div>

      </div>
    </div>
  );
};

export default Login;