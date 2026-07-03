// src/pages/InterviewSetup.tsx
import { useEffect } from 'react';

function InterviewSetup() {
  
  const testStreamApi = async () => {
    const API_KEY_REF = import.meta.env.VITE_OPENROUTER_API_KEY;

    console.log("در حال ارسال درخواست به OpenRouter...");

    const question = 'سلام چطوری ؟';
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY_REF}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [{ role: 'user', content: question }],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Append new chunk to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines from buffer
          while (true) {
            const lineEnd = buffer.indexOf('\n');
            if (lineEnd === -1) break;

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0].delta.content;
                if (content) {
                  // چاپ کلمات دریافتی به صورت زنده در کنسول
                  console.log(content);
                }
              } catch (e) {
                // Ignore invalid JSON
              }
            }
          }
        }
      } finally {
        reader.cancel();
      }
    } catch (error) {
      console.error("خطا در برقراری ارتباط:", error);
    }
  };

  // این بخش باعث می‌شود به محض اینکه وارد این صفحه شدی، تابع بالا خودکار اجرا شود
  useEffect(() => {
    testStreamApi();
  }, []);

  // بدون کد UI خاص، فقط یک متن ساده برای خالی نبودن صفحه
  return (
    <>
    </>
  );
}

export default InterviewSetup;