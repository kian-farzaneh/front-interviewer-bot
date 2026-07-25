// src/pages/InterviewSetup.tsx
import { useEffect } from "react";

function InterviewSetup() {
  const testStreamApi = async () => {
    console.log("در حال ارسال درخواست به سرور خودمان...");

    const question = "سلام چطوری ؟";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: question }],
        }),
      });

      if (!response.ok) {
        throw new Error("پاسخ سرور با خطا مواجه شد");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let isDone = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          while (true) {
            const lineEnd = buffer.indexOf("\n");
            if (lineEnd === -1) break;

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                isDone = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  console.log(content);
                }
              } catch (e) {}
            }
          }

          if (isDone) break;
        }
      } finally {
        reader.cancel();
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
