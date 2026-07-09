// src/pages/InterviewSetup.tsx
import { useEffect } from 'react';

function InterviewSetup() {
  
  const testStreamApi = async () => {
    console.log("در حال ارسال درخواست به سرور خودمان...");

    const question = 'سلام چطوری ؟';
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [{ role: 'user', content: question }],
        }),
      });

      if (!response.ok) {
        throw new Error('پاسخ سرور با خطا مواجه شد');
      }

      // دریافت جِریان داده (Stream) از بک‌آند خودمان
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let isDone = false; // برای کنترل خروج کامل از حلقه‌ها

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // چسباندن پکیج جدید به بافر
          buffer += decoder.decode(value, { stream: true });

          // پردازش خط به خط متن استریم
          while (true) {
            const lineEnd = buffer.indexOf('\n');
            if (lineEnd === -1) break;

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              // بررسی پایان استریم
              if (data === '[DONE]') {
                isDone = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  // چاپ زندۀ کلمات در کنسول بدون ارور JSON
                  console.log(content);
                }
              } catch (e) {
                // نادیده گرفتن کدهای ناقص یا غیر JSON
              }
            }
          }

          // اگر استریم تمام شده بود، حلقه اصلی را هم بشکن
          if (isDone) break;
        }
      } finally {
        reader.cancel(); // بستن ایمن خواننده استریم
      }

    } catch (error) {
      console.error("خطا در برقراری ارتباط:", error);
    }
  };

  useEffect(() => {
    testStreamApi();
  }, []);

  return <></>;
}

export default InterviewSetup;