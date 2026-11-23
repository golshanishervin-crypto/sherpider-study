// این یک شبیه‌ساز (Mock) از Supabase است که از دیتابیس مرورگر استفاده می‌کند

export const supabase = {
  auth: {
    // ثبت‌نام
    signUp: async ({ email, password }: any) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        return { error: { message: 'کاربر با این ایمیل قبلا ثبت‌نام کرده است' } };
      }
      const newUser = { id: Date.now().toString(), email, password, user_metadata: { name: email.split('@')[0] } };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { data: { user: newUser }, error: null };
    },

    // ورود
    signInWithPassword: async ({ email, password }: any) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        return { error: { message: 'ایمیل یا رمز عبور اشتباه است' } };
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { data: { user }, error: null };
    },

    // خروج
    signOut: async () => {
      localStorage.removeItem('currentUser');
      return { error: null };
    },

    // گرفتن اطلاعات کاربر فعلی
    getUser: async () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        return { data: { user: JSON.parse(currentUser) }, error: null };
      }
      return { data: { user: null }, error: null };
    },

    // گوش دادن به تغییرات وضعیت لاگین
    onAuthStateChange: (callback: any) => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        callback('SIGNED_IN', { user: JSON.parse(currentUser) });
      } else {
        callback('SIGNED_OUT', null);
      }
      
      // یک شنونده ساده برای تغییرات
      const listener = () => {
        const user = localStorage.getItem('currentUser');
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user: JSON.parse(user) } : null);
      };
      
      // این یک شبیه‌سازی ساده است
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  
  // برای بخش‌هایی که از from استفاده می‌کنند (مثل دیتابیس)
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        single: async () => {
           // اگر نیاز به دیتابیس داشتی اینجا میتونی منطق بنویسی
           return { data: null, error: null };
        }
      }),
      order: () => ({ data: [], error: null })
    }),
    insert: async (data: any) => {
       return { data, error: null };
    },
    update: (data: any) => ({
      eq: async (col: string, val: any) => ({ data, error: null })
    }),
    delete: () => ({
      eq: async (col: string, val: any) => ({ error: null })
    })
  })
};
