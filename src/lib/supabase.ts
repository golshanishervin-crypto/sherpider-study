// یک دیتابیس محلی کامل که جایگزین Supabase شده است
export const supabase = {
  auth: {
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
    signInWithPassword: async ({ email, password }: any) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) return { error: { message: 'ایمیل یا رمز عبور اشتباه است' } };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('currentUser');
      return { error: null };
    },
    getUser: async () => {
      const currentUser = localStorage.getItem('currentUser');
      return { data: { user: currentUser ? JSON.parse(currentUser) : null }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      const currentUser = localStorage.getItem('currentUser');
      callback(currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', currentUser ? { user: JSON.parse(currentUser) } : null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  
  from: (table: string) => {
    let filters: any[] = [];
    let orderCol = '';
    let orderAsc = true;
    let limitNum = 0;

    const builder = {
      select: (cols?: string) => builder,
      
      eq: (col: string, val: any) => { 
        filters.push({col, val}); 
        return builder; 
      },
      
      order: (col: string, opts?: { ascending: boolean }) => { 
        orderCol = col; 
        orderAsc = opts?.ascending ?? true; 
        return builder; 
      },
      
      limit: (n: number) => { 
        limitNum = n; 
        return builder; 
      },
      
      single: async () => {
         const res = await builder.execute();
         return res.data && res.data.length > 0 ? { data: res.data[0], error: null } : { data: null, error: { message: 'Not found' } };
      },
      
      execute: async () => {
        let data = JSON.parse(localStorage.getItem('db_' + table) || '[]');
        for (const f of filters) {
          data = data.filter((d: any) => d[f.col] === f.val);
        }
        if (orderCol) {
          data.sort((a: any, b: any) => orderAsc ? (a[orderCol] > b[orderCol] ? 1 : -1) : (a[orderCol] < b[orderCol] ? 1 : -1));
        }
        if (limitNum) data = data.slice(0, limitNum);
        return { data, error: null };
      },
      
      // برای اینکه await مستقیم روی builder کار کنه
      then: (resolve: any) => { builder.execute().then(resolve); },
      
      insert: async (val: any) => {
        const current = JSON.parse(localStorage.getItem('db_' + table) || '[]');
        const newItems = Array.isArray(val) ? val : [val];
        const saved = newItems.map((item: any) => ({...item, id: item.id || Date.now().toString()}));
        localStorage.setItem('db_' + table, JSON.stringify([...current, ...saved]));
        return { data: saved, error: null };
      },
      
      update: (val: any) => ({
         eq: async (col: string, valEq: any) => {
           const current = JSON.parse(localStorage.getItem('db_' + table) || '[]');
           const updated = current.map((item: any) => item[col] === valEq ? { ...item, ...val } : item);
localStorage.setItem('db_' + table, JSON.stringify(updated));
           return { data: updated, error: null };
         }
      }),
      
      delete: () => ({
         eq: async (col: string, valEq: any) => {
           const current = JSON.parse(localStorage.getItem('db_' + table) || '[]');
           const filtered = current.filter((item: any) => item[col] !== valEq);
           localStorage.setItem('db_' + table, JSON.stringify(filtered));
           return { error: null };
         }
      })
    };
    return builder as any;
  }
};
