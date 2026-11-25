export const miles = {
  reply: async (text: string) => {
    // کلید API خودت رو اینجا بذار
    const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY


    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + DEEPSEEK_API_KEY
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: 'تو مایلز هستی، یک دستیار هوشمند، صمیمی و انگیزه‌بخش برای دانش‌آموزان ایرانی. به زبان فارسی، دوستانه و کوتاه جواب بده.' 
            },
            { role: 'user', content: text }
          ]
        })
      });
      
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      return { 
        text: data.choices[0].message.content, 
        quickReplies: [] 
      };
      
    } catch (error) {
      return { 
        text: 'ارتباط با سرور مایلز برقرار نشد. لطفاً اتصال اینترنت (و در صورت نیاز VPN) را بررسی کنید.', 
        quickReplies: [] 
      };
    }
  }
};