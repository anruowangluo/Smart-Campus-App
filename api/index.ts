
import request from '../utils/request';
import { NewsItem, ServiceItem, UserProfile, CommentItem, PostItem } from '../types';

// --- Mock Data Definitions ---

export const MOCK_USER: UserProfile = {
  name: '张三',
  studentId: '2023010123',
  department: '计算机科学与技术学院',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1qCTLKrEcwJ40Nleob7klo_jbe1nj5-R7vT_gQev2w5bGj_znZK1ohg71EvuuI1hMnbWfX-cFyGc9avx4AL6qRmIUDsVFRwH3PtLV1a8J2Ch6vlp5Pd2JfQ6P1SzmS54E5GGcdt4MVJWiuV7kio-71BZUqSOF8SAsI0OQVxXFauQKXIuUZKsFZ3n4cdS64D4DlgXeyh3G3y8j_Zk89ZJYvHfPUJYIUDl3-mi7Xj5V6FC_k47uphpgd_ARxYic0LTDC2JNHNVecT0V'
};

export const MOCK_NEWS: NewsItem[] = [
  { 
    id: '1', 
    title: '关于2024年寒假放假安排的通知', 
    tag: '置顶', 
    tagColor: 'primary', 
    date: '2024-01-10', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTDWyio-3fWUNRBObJVvCKO7BTLkuhe38Ici3iHt9EIULd6Q4wYAJse43yrKd-IeGJoQqrppLEfmkaTGiHGDZuaCwrF3hAvYTC-spzlBa6N2Y2LLZqFetuyygaNjd5W30tTNgaFZ-9DiZkwgsVR_kHKck90Q9P_L5hGEz285_WtOD1imsRNKEOKCJLmXtfnCqn5wvcGgUbnFB2tdMs0p9tQxbtpD3BzlQ35tTIbX2A3Kc586CGNfvoHjwGu-gnDm7krGpLBKdpkJKq',
    content: "各位师生员工：\n\n根据学校校历安排，现将2024年寒假放假及下学期开学有关事项通知如下：\n\n一、学生放假时间\n2024年1月20日（星期六）至2月24日（星期六）。2月25日（星期日）报到注册，2月26日（星期一）正式上课。\n\n二、教职工放假时间\n1. 专任教师：2024年1月20日（星期六）至2月23日（星期五）。2月24日（星期六）正式上班。\n2. 管理人员、教辅人员、工勤人员：在确保学校各项工作正常运行的前提下，由各单位具体安排轮休。2月24日（星期六）全体正式上班。\n\n三、相关要求\n1. 各单位要切实做好寒假期间的安全稳定工作，离校前进行一次全面的安全检查，消除安全隐患。\n2. 全体师生员工要保持通讯畅通，注意假期出行安全。\n\n特此通知。\n\n校长办公室\n2024年1月10日"
  },
  { 
    id: '2', 
    title: '图书馆开馆时间调整公告', 
    tag: '通知', 
    tagColor: 'red', 
    date: '2024-01-15', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlXS-kxRUrTjqGihdn4-qadWh30SOBINbb99-7VZxdLluHJ3PfHKu2sqx5J3mIawf9BWdi7M9xld7TrMjkXzUbcu1LTK-Xk36w7GoZN-5j2K57UhJld3ic_w4vHQgaPvYMJ8X7bdn-F_1oEzTrmyL1W-q6BNv_CrMlPWwFGpeo2cpYSCKUuDn5Q8QBPPkPrqvL1zCJOpLRG40iZP2uRUdZHTrn8L0QFFqsSxcEcCDrlGt1yLM1VXJMMlZKvcqT-1yw67oje_Doa5Ga',
    content: "各位读者：\n\n为满足假期留校师生的学习科研需求，寒假期间图书馆开馆时间调整如下：\n\n1. 总馆：\n   - 1月20日 - 2月8日：8:00 - 17:00\n   - 2月9日 - 2月17日（春节期间）：闭馆\n   - 2月18日 - 2月24日：8:00 - 17:00\n\n2. 分馆：\n   - 寒假期间暂停开放。\n\n3. 电子资源：\n   - 24小时正常访问。\n\n请各位读者相互转告。\n\n图书馆\n2024年1月15日"
  },
];

export const MOCK_POSTS: PostItem[] = [
    {
      id: '4',
      user: {
        name: '校学生会',
        avatar: '会',
        role: '官方账号',
        bgColor: 'bg-blue-600 text-white',
        color: 'text-white'
      },
      time: '30分钟前',
      content: '【话题讨论】今年的校园十佳歌手大赛，你最期待谁的返场表演？快在评论区告诉我们吧！👇👇👇',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTDWyio-3fWUNRBObJVvCKO7BTLkuhe38Ici3iHt9EIULd6Q4wYAJse43yrKd-IeGJoQqrppLEfmkaTGiHGDZuaCwrF3hAvYTC-spzlBa6N2Y2LLZqFetuyygaNjd5W30tTNgaFZ-9DiZkwgsVR_kHKck90Q9P_L5hGEz285_WtOD1imsRNKEOKCJLmXtfnCqn5wvcGgUbnFB2tdMs0p9tQxbtpD3BzlQ35tTIbX2A3Kc586CGNfvoHjwGu-gnDm7krGpLBKdpkJKq',
      stats: { likes: 1024, comments: 88, shares: 205 },
      isLiked: false
    },
    {
      id: '1',
      user: {
        name: '张同学',
        avatar: '张',
        role: '2024届学生',
        bgColor: 'bg-primary/10',
        color: 'text-primary'
      },
      time: '10分钟前',
      content: '今天图书馆的落日真美，复习也有了动力！大家加油！',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlXS-kxRUrTjqGihdn4-qadWh30SOBINbb99-7VZxdLluHJ3PfHKu2sqx5J3mIawf9BWdi7M9xld7TrMjkXzUbcu1LTK-Xk36w7GoZN-5j2K57UhJld3ic_w4vHQgaPvYMJ8X7bdn-F_1oEzTrmyL1W-q6BNv_CrMlPWwFGpeo2cpYSCKUuDn5Q8QBPPkPrqvL1zCJOpLRG40iZP2uRUdZHTrn8L0QFFqsSxcEcCDrlGt1yLM1VXJMMlZKvcqT-1yw67oje_Doa5Ga',
      stats: { likes: 128, comments: 24, shares: 12 },
      isLiked: false
    },
];

export const MOCK_COMMENTS: CommentItem[] = [
    {
      id: '1',
      user: { name: '李明', avatar: '李', bgColor: 'bg-blue-100 text-blue-600' },
      content: '终于等到通知了，看来要准备买票了！大家开学见！',
      time: '2小时前',
      likes: 24,
      replies: []
    },
];

// --- Services Data Structure ---

const SERVICE_LIB = { id: 's_lib', name: '图书馆', icon: 'local_library', color: 'text-primary', bgColor: 'bg-indigo-50' };
const SERVICE_COURSE = { id: 's_course', name: '课程表', icon: 'calendar_month', color: 'text-indigo-500', bgColor: 'bg-indigo-50' };
const SERVICE_SCORE = { id: 's_score', name: '成绩查询', icon: 'score', color: 'text-indigo-500', bgColor: 'bg-indigo-50' };
const SERVICE_EXAM = { id: 's_exam', name: '考试安排', icon: 'edit_note', color: 'text-indigo-500', bgColor: 'bg-indigo-50' };
const SERVICE_ROOM = { id: 's_room', name: '空闲教室', icon: 'meeting_room', color: 'text-indigo-500', bgColor: 'bg-indigo-50' };

const SERVICE_CARD = { id: 's_card', name: '校园卡', icon: 'credit_card', color: 'text-cyan-500', bgColor: 'bg-cyan-50' };
const SERVICE_REPAIR = { id: 's_repair', name: '报修服务', icon: 'build', color: 'text-cyan-500', bgColor: 'bg-cyan-50' };
const SERVICE_LOST = { id: 's_lost', name: '失物招领', icon: 'search', color: 'text-cyan-500', bgColor: 'bg-cyan-50' };
const SERVICE_DORM = { id: 's_dorm', name: '宿舍门禁', icon: 'meeting_room', color: 'text-blue-500', bgColor: 'bg-blue-50' };
const SERVICE_LAUNDRY = { id: 's_laundry', name: '洗衣房', icon: 'local_laundry_service', color: 'text-green-500', bgColor: 'bg-green-50' };
const SERVICE_FOOD = { id: 's_food', name: '餐厅', icon: 'restaurant', color: 'text-orange-500', bgColor: 'bg-orange-50' };

const SERVICE_WATER = { id: 's_water', name: '水费充值', icon: 'water_drop', color: 'text-blue-500', bgColor: 'bg-blue-50' };
const SERVICE_ELEC = { id: 's_elec', name: '电费充值', icon: 'bolt', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
const SERVICE_TUITION = { id: 's_tuition', name: '学费缴纳', icon: 'payments', color: 'text-red-500', bgColor: 'bg-red-50' };

const SERVICE_CALENDAR = { id: 's_cal', name: '校历', icon: 'today', color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
const SERVICE_BUS = { id: 's_bus', name: '校车时刻', icon: 'directions_bus', color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
const SERVICE_GUIDE = { id: 's_guide', name: '办事指南', icon: 'description', color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
const SERVICE_PHONE = { id: 's_phone', name: '常用电话', icon: 'call', color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
const SERVICE_DEBUG = { id: 'debug-vconsole', name: '开启调试', icon: 'bug_report', color: 'text-slate-800', bgColor: 'bg-gray-200' };

export const MOCK_ALL_SERVICES: Record<string, ServiceItem[]> = {
  edu: [SERVICE_COURSE, SERVICE_SCORE, SERVICE_EXAM, SERVICE_ROOM, SERVICE_LIB],
  life: [SERVICE_CARD, SERVICE_REPAIR, SERVICE_LOST, SERVICE_DORM, SERVICE_LAUNDRY, SERVICE_FOOD],
  asset: [SERVICE_WATER, SERVICE_ELEC, SERVICE_TUITION],
  public: [SERVICE_CALENDAR, SERVICE_BUS, SERVICE_GUIDE, SERVICE_PHONE, SERVICE_DEBUG]
};

export const MOCK_DEFAULT_HOME_SERVICES: ServiceItem[] = [
  SERVICE_COURSE, SERVICE_SCORE, SERVICE_CARD, SERVICE_ELEC,
  SERVICE_LIB, SERVICE_FOOD, SERVICE_BUS, SERVICE_DEBUG
];

// --- Login & User API ---

export const getCaptchaImage = async () => {
  try {
    const res: any = await request.get('/captchaImage');
    return res;
  } catch (error) {
    console.warn("API /captchaImage failed. Using fallback mock.");
    // Fallback Mock
    return {
      code: 200,
      msg: '操作成功',
      uuid: 'mock-uuid-' + Date.now(),
      img: '', // Empty img indicates frontend might skip or show text
      captchaEnabled: false 
    };
  }
};

export const login = async (username: string, password: string, code?: string, uuid?: string): Promise<{ token: string }> => {
  try {
    const res: any = await request.post('/login', { username, password, code, uuid });
    // Assuming backend returns { code: 200, token: '...' }
    if (res.token) {
      return { token: res.token };
    }
    throw new Error(res.msg || 'Login failed');
  } catch (error: any) {
    // If it's a real API error, rethrow it
    if (error.response || error.message !== 'Network Error') {
        throw error;
    }

    console.warn('API /login failed, using mock fallback.');
    // Mock Fallback
    await new Promise(resolve => setTimeout(resolve, 800));
    return { token: 'mock-jwt-token-' + Date.now() };
  }
};

export const getUserProfile = async () => {
  try {
    const res: any = await request.get('/getInfo');
    if (res && res.user) {
      // Map backend "user" object to frontend "UserProfile"
      const u = res.user;
      return {
          name: u.nickName || u.userName || '用户',
          studentId: String(u.userId || u.userName || ''),
          department: u.dept?.deptName || '智慧校园',
          avatar: u.avatar && u.avatar.startsWith('http') ? u.avatar : MOCK_USER.avatar
      };
    }
    return MOCK_USER;
  } catch (error) {
    console.warn('API /getInfo unavailable, using mock data.');
    return MOCK_USER;
  }
};

// --- Other Data APIs ---

export const getNews = async () => {
  try {
    const res: any = await request.get('/api/news');
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return res.data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        tag: item.tag,
        tagColor: item.tagColor,
        date: item.createTime ? item.createTime.split(' ')[0] : (item.date || ''), 
        image: item.image,
        content: item.content
      }));
    }
    if (Array.isArray(res)) return res;
    return MOCK_NEWS;
  } catch (error) {
    // console.warn('API /api/news unavailable, using mock data.');
    return MOCK_NEWS;
  }
};

const mapComments = (data: any[]): CommentItem[] => {
  return data.map((item: any) => ({
    id: String(item.id),
    user: {
      name: item.userName || item.createBy || '匿名',
      avatar: (item.userName || item.createBy || '匿')[0],
      bgColor: 'bg-blue-100 text-blue-600'
    },
    content: item.content,
    time: item.createTime || '刚刚',
    likes: item.likes || 0,
    replies: Array.isArray(item.children) ? mapComments(item.children).map(c => ({
         ...c,
         replyToUser: (c as any).replyToUser 
    })) : [],
    replyToUser: item.replyToUser
  }));
};

export const getNewsComments = async (newsId: string): Promise<CommentItem[]> => {
  try {
    const res: any = await request.get('/api/news/comments', { params: { newsId } });
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return mapComments(res.data);
    }
    return MOCK_COMMENTS;
  } catch (error) {
    return MOCK_COMMENTS;
  }
};

export const createNewsComment = async (newsId: string, content: string, parentId?: string, replyToUser?: string): Promise<CommentItem | null> => {
  try {
    const res: any = await request.post('/api/news/comments', { newsId, content, parentId, replyToUser });
    if (res && res.code === 200 && res.data) {
       return {
         id: String(res.data.id),
         user: {
           name: res.data.userName || '我',
           avatar: res.data.userAvatar || '我',
           bgColor: 'bg-primary text-white'
         },
         content: res.data.content,
         time: '刚刚',
         likes: 0,
         replies: [],
         replyToUser: res.data.replyToUser
       };
    }
    return null;
  } catch (error) {
    return {
      id: Date.now().toString(),
      user: { name: '我', avatar: '我', bgColor: 'bg-primary text-white' },
      content,
      time: '刚刚',
      likes: 0,
      replies: [],
      replyToUser
    };
  }
};

export const getPostComments = async (postId: string): Promise<CommentItem[]> => {
  try {
    const res: any = await request.get('/api/post/comments', { params: { postId } });
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return mapComments(res.data);
    }
    return MOCK_COMMENTS;
  } catch (error) {
    return MOCK_COMMENTS;
  }
};

export const createPostComment = async (postId: string, content: string, parentId?: string, replyToUser?: string): Promise<CommentItem | null> => {
  try {
    const res: any = await request.post('/api/post/comments', { postId, content, parentId, replyToUser });
    if (res && res.code === 200 && res.data) {
       return {
         id: String(res.data.id),
         user: {
           name: res.data.userName || '我',
           avatar: res.data.userAvatar || '我',
           bgColor: 'bg-primary text-white'
         },
         content: res.data.content,
         time: '刚刚',
         likes: 0,
         replies: [],
         replyToUser: res.data.replyToUser
       };
    }
    return null;
  } catch (error) {
    return {
      id: Date.now().toString(),
      user: { name: '我', avatar: '我', bgColor: 'bg-primary text-white' },
      content,
      time: '刚刚',
      likes: 0,
      replies: [],
      replyToUser
    };
  }
};

export const getPosts = async (page = 1, pageSize = 10): Promise<PostItem[]> => {
  try {
    const res: any = await request.get('/api/posts', { params: { page, pageSize }});
    
    let rawList: any[] = [];
    if (res && res.code === 200 && res.data && Array.isArray(res.data.list)) {
        rawList = res.data.list;
    } else if (res && res.code === 200 && Array.isArray(res.rows)) {
        rawList = res.rows;
    } else if (res && res.code === 200 && Array.isArray(res.data)) {
        rawList = res.data;
    }

    if (rawList.length > 0) {
        return rawList.map((item: any) => ({
             id: String(item.id),
             user: {
                 name: item.userName || item.user?.name || 'Unknown',
                 avatar: item.userAvatar || item.user?.avatar || (item.userName?.[0] || 'U'),
                 role: item.userRole || item.user?.role || 'User',
                 bgColor: item.userBgColor || item.user?.bgColor || 'bg-blue-100 text-blue-600',
                 color: item.userColor || item.user?.color || 'text-blue-600'
             },
             time: item.createTime || item.time || 'Just now',
             content: item.content,
             image: item.image,
             stats: {
                 likes: item.likes || 0,
                 comments: item.comments || 0,
                 shares: item.shares || 0
             },
             isLiked: Boolean(item.isLiked)
        }));
    }
    if (Array.isArray(res)) return res;
    return generateMockPosts(page, pageSize);
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateMockPosts(page, pageSize);
  }
};

const generateMockPosts = (page: number, pageSize: number) => {
    if (page === 1) return MOCK_POSTS;
    return Array.from({ length: pageSize }).map((_, i) => {
        const template = MOCK_POSTS[i % MOCK_POSTS.length];
        return {
            ...template,
            id: `${page}-${i}-${Date.now()}`,
            time: `${page}天前`,
            stats: {
                likes: Math.floor(Math.random() * 500),
                comments: Math.floor(Math.random() * 50),
                shares: Math.floor(Math.random() * 20)
            },
            isLiked: Math.random() > 0.8
        };
    });
};

export const createPost = async (content: string, image?: string): Promise<PostItem | null> => {
  try {
    const res: any = await request.post('/api/posts', { content, image });
    if (res && res.code === 200 && res.data) {
       const item = res.data;
       return {
             id: String(item.id),
             user: {
                 name: item.userName || item.user?.name || '我',
                 avatar: item.userAvatar || item.user?.avatar || '我',
                 role: item.userRole || item.user?.role || '刚刚',
                 bgColor: item.user?.bgColor || 'bg-primary text-white',
                 color: item.user?.color || 'text-white'
             },
             time: '刚刚',
             content: item.content,
             image: item.image,
             stats: {
                 likes: 0,
                 comments: 0,
                 shares: 0
             },
             isLiked: false
        };
    }
    return null;
  } catch (error) {
    return {
      id: Date.now().toString(),
      user: {
        name: '我',
        avatar: '我',
        role: '刚刚',
        bgColor: 'bg-primary text-white',
        color: 'text-white'
      },
      time: '刚刚',
      content,
      image,
      stats: { likes: 0, comments: 0, shares: 0 },
      isLiked: false
    };
  }
};

export const getServices = async () => {
  try {
    const res: any = await request.get('/api/services');
    if (res && res.code === 200 && res.data) {
      const result: Record<string, ServiceItem[]> = {};
      Object.keys(res.data).forEach(key => {
        if (Array.isArray(res.data[key])) {
            result[key] = res.data[key].map((item: any) => ({
                ...item,
                id: String(item.id)
            }));
        }
      });
      return result;
    }
    return MOCK_ALL_SERVICES;
  } catch (error) {
    return MOCK_ALL_SERVICES;
  }
};

export const getCommonServices = async () => {
  try {
    const res: any = await request.get('/api/services/common');
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return res.data.map((item: any) => ({
        ...item,
        id: String(item.id)
      }));
    }
    return MOCK_DEFAULT_HOME_SERVICES;
  } catch (error) {
    return MOCK_DEFAULT_HOME_SERVICES;
  }
};
