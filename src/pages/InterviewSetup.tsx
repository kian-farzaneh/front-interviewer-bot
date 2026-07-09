// src/pages/InterviewSetup.tsx
import { useEffect } from 'react';

function InterviewSetup() {
  
  const testApiThroughBackend = async () => {
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
        throw new Error('خطا در پاسخ سرور خودمان');
      }

      const data = await response.json();
      
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        console.log("پاسخ هوش مصنوعی:", content);
      }
    } catch (error) {
      console.error("خطا در برقراری ارتباط:", error);
    }
  };

  useEffect(() => {
    testApiThroughBackend();
  }, []);

  return <></>;
}

export default InterviewSetup;