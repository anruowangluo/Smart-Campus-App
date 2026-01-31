import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import { ServiceItem } from '../types';
import { getServices } from '../api/index';

interface AppsProps {
  onSearch: () => void;
  myServices: ServiceItem[];
  onUpdateMyServices: (services: ServiceItem[]) => void;
}

const Apps: React.FC<AppsProps> = ({ onSearch, myServices, onUpdateMyServices }) => {
  const [activeCategory, setActiveCategory] = useState('edu');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);
  const [serviceData, setServiceData] = useState<Record<string, ServiceItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const categories = [
    { id: 'edu', label: '教务' },
    { id: 'life', label: '生活' },
    { id: 'asset', label: '财务' },
    { id: 'public', label: '公共' },
  ];

  useEffect(() => {
    getServices()
      .then(data => {
        setServiceData(data);
      })
      .catch(err => {
        console.error("Failed to fetch services", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (id: string) => {
    isClickScrolling.current = true;
    setActiveCategory(id);
    const element = document.getElementById(`section-${id}`);
    if (element && scrollContainerRef.current) {
        const top = element.offsetTop;
        scrollContainerRef.current.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => {
          isClickScrolling.current = false;
        }, 500);
    } else {
      isClickScrolling.current = false;
    }
  };

  const handleScroll = () => {
    if (isClickScrolling.current || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollTop } = container;
    
    let newActiveId = categories[0].id;
    const threshold = 50; 
    
    for (const cat of categories) {
      const element = document.getElementById(`section-${cat.id}`);
      if (element) {
        if (element.offsetTop - threshold <= scrollTop) {
          newActiveId = cat.id;
        }
      }
    }
    
    if (newActiveId !== activeCategory) {
      setActiveCategory(newActiveId);
    }
  };

  const toggleService = (service: ServiceItem) => {
    if (!isEditing) return;

    const exists = myServices.find(s => s.id === service.id);
    if (exists) {
        // Remove
        onUpdateMyServices(myServices.filter(s => s.id !== service.id));
    } else {
        // Add (Max 8)
        if (myServices.length >= 8) {
            alert('最多添加 8 个首页服务');
            return;
        }
        onUpdateMyServices([...myServices, service]);
    }
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
        setIsCollapsed(false); // Auto expand when entering edit mode
    }
    setIsEditing(!isEditing);
  };

  const sectionColors: Record<string, string> = {
    edu: 'bg-indigo-500',
    life: 'bg-cyan-500',
    asset: 'bg-orange-500',
    public: 'bg-emerald-500'
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex-none z-40 bg-background-light dark:bg-background-dark pt-safe-top">
        <div className="flex items-center px-4 pt-2 pb-2 justify-center relative">
          <h2 className="text-[17px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">全部应用</h2>
        </div>
        <div className="px-4 pb-2">
          {/* Search Trigger Button */}
          <button 
            onClick={onSearch}
            className="flex flex-col h-10 w-full relative group"
          >
            <div className="flex w-full flex-1 items-center rounded-xl h-full overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50 group-active:bg-gray-50 dark:group-active:bg-gray-700 transition-colors">
              <div className="text-gray-400 flex border-none items-center justify-center pl-3">
                <Icon name="search" size={20} />
              </div>
              <span className="flex-1 text-left text-sm font-normal text-gray-400 px-2">
                搜索服务、功能
              </span>
            </div>
          </button>
        </div>
      </header>
      
      {/* Home Services Editor (My Apps) - Collapsible & Inline */}
      <div className="flex-none px-4 pt-2 pb-2 bg-background-light dark:bg-background-dark">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
           <div className="flex items-center justify-between">
             {/* Toggle Area: Title + Icons + Arrow */}
             <div 
                className="flex-1 flex items-center overflow-hidden cursor-pointer py-1"
                onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}
             >
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white shrink-0 mr-2">
                    首页服务
                </h3>
                
                {/* Inline Icons (Visible only when collapsed) */}
                {isCollapsed && (
                    <div className="flex items-center gap-1.5 mr-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        {myServices.slice(0, 6).map((service) => (
                            <div key={service.id} className={`size-5 rounded-md ${service.bgColor} flex items-center justify-center shrink-0`}>
                                <Icon name={service.icon} className={`${service.color} text-[14px]`} />
                            </div>
                        ))}
                        {myServices.length > 6 && (
                            <div className="size-1 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0 mx-0.5"></div>
                        )}
                    </div>
                )}

                <Icon 
                    name="expand_more" 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
                />
             </div>
             
             {/* Edit Button */}
             <button 
               onClick={handleToggleEdit}
               className={`ml-3 px-3.5 py-1 rounded-full text-[13px] font-medium transition-colors border ${
                 isEditing 
                   ? 'bg-primary text-white border-primary' 
                   : 'text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
               }`}
             >
               {isEditing ? '完成' : '编辑'}
             </button>
           </div>
           
           {/* Expanded View: Grid */}
           <div className={`grid grid-cols-4 gap-y-3 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 mt-0 p-0' : 'max-h-[300px] opacity-100 mt-4 p-2'}`}>
             {myServices.map((service) => (
                <div 
                   key={service.id} 
                   className="flex flex-col items-center gap-1.5 relative group cursor-pointer"
                   onClick={() => toggleService(service)}
                >
                   <div className={`relative size-10 rounded-2xl ${service.bgColor} dark:bg-gray-800 flex items-center justify-center transition-transform ${isEditing ? 'shake-animation' : ''}`}>
                      <Icon name={service.icon} className={`${service.color} text-[20px]`} />
                      {isEditing && (
                         <div className="absolute -top-1.5 -right-1.5 size-4 bg-red-500 rounded-full flex items-center justify-center border border-white dark:border-gray-900 z-10">
                            <Icon name="remove" size={12} className="text-white" />
                         </div>
                      )}
                   </div>
                   <span className="text-[10px] font-medium text-center text-gray-600 dark:text-gray-300 truncate w-full px-1">
                      {service.name}
                   </span>
                </div>
             ))}
             {/* Placeholders */}
             {!isCollapsed && Array.from({ length: Math.max(0, 8 - myServices.length) }).map((_, idx) => (
                <div key={`empty-${idx}`} className="flex flex-col items-center gap-1.5 opacity-30">
                   <div className="size-10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                   </div>
                   <span className="text-[10px] text-transparent">Empty</span>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 flex overflow-hidden relative border-t border-gray-100 dark:border-gray-800">
        {/* Sidebar */}
        <aside className="w-[88px] flex-none bg-gray-100/50 dark:bg-gray-900/50 overflow-y-auto no-scrollbar flex flex-col gap-1 pb-[calc(env(safe-area-inset-bottom,20px)+60px)]">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`relative h-11 px-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 
                ${activeCategory === cat.id 
                  ? 'bg-white dark:bg-gray-800 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 active:bg-gray-200 dark:active:bg-gray-800'}`}
            >
              {activeCategory === cat.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full"></div>
              )}
              <span className={`text-sm font-medium ${activeCategory === cat.id ? 'text-primary font-bold' : ''}`}>
                {cat.label}
              </span>
            </div>
          ))}
        </aside>

        {/* Grid Content */}
        <div 
          className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto px-4 no-scrollbar scroll-smooth relative" 
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {loading ? (
              <div className="flex items-center justify-center h-40">
                <span className="text-gray-400 text-sm">加载中...</span>
              </div>
          ) : (
            categories.map((cat, index) => {
              const isLast = index === categories.length - 1;
              const items = serviceData[cat.id] || [];
              
              return (
                <section 
                  key={cat.id} 
                  id={`section-${cat.id}`} 
                  className={`scroll-mt-2 ${isLast ? 'min-h-full pb-[calc(env(safe-area-inset-bottom,20px)+60px)]' : 'mb-8'}`}
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 h-11 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <span className={`w-1 h-3 rounded-full ${sectionColors[cat.id]}`}></span>
                    {cat.label === '常用' ? '常用服务' : 
                    cat.label === '教务' ? '教务教学' :
                    cat.label === '生活' ? '校园生活' : 
                    cat.label === '财务' ? '资产财务' : '公共服务'}
                  </h3>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                    {items.map((service) => {
                      const isAdded = myServices.some(s => s.id === service.id);
                      return (
                      <div 
                        key={service.id} 
                        className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity relative"
                        onClick={() => isEditing && toggleService(service)}
                      >
                        <div className={`size-11 rounded-2xl ${service.bgColor} flex items-center justify-center relative`}>
                          <Icon name={service.icon} className={`${service.color} text-[24px]`} />
                          
                          {/* Add/Remove Badge in list when editing */}
                          {isEditing && (
                             <div className={`absolute -top-1.5 -right-1.5 size-4 rounded-full flex items-center justify-center border border-white dark:border-gray-900 shadow-sm z-10 ${
                                isAdded ? 'bg-gray-400' : 'bg-green-500'
                             }`}>
                                <Icon name={isAdded ? 'check' : 'add'} size={12} className="text-white" />
                             </div>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-center text-gray-600 dark:text-gray-300">
                          {service.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .shake-animation {
          animation: shake 0.3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Apps;