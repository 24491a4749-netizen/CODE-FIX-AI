
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const API = "http://127.0.0.1:8000";

const pages = {
  chat: {
    title: "AI Code Assistant",
  },
  debug: {
    title: "Code Debugger",
    button: "Analyze & Fix",
    resultTitle: "AI Debugging Report",
  },
  explain: {
    title: "Code Explainer",
    button: "Explain Code",
    resultTitle: "Code Explanation",
  },
  optimize: {
    title: "Code Optimizer",
    button: "Optimize Code",
    resultTitle: "Code Optimization Report",
  },
  generate: {
    title: "Code Generator",
    button: "Generate Code",
    resultTitle: "Generated Code",
  },
};

export default function App() {
  const [page, setPage] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [code, setCode] = useState('print("Hello World")');
  const [language, setLanguage] = useState("python");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);

  function changePage(nextPage) {
    setPage(nextPage);
    setError("");
    setResult(null);
  }

  async function sendMessage() {
    if (!question.trim() || loading) return;

    const promptText = question.trim();
    const previousMessages = messages;

    setMessages((old) => [
      ...old,
      { role: "user", content: promptText },
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          history: previousMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "AI chat request failed"
        );
      }

      setMessages((old) => [
        ...old,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err.message +
          ". Check that the backend is running and the API key is configured."
      );
    } finally {
      setLoading(false);
    }
  }

  async function runCodeTool() {
    if (loading) return;

    if (page === "generate" && !prompt.trim()) {
      setError("Please describe the program you want to generate.");
      return;
    }

    if (page !== "generate" && !code.trim()) {
      setError("Please enter your code first.");
      return;
    }

    const endpoints = {
      debug: "/api/debug",
      explain: "/api/explain",
      optimize: "/api/optimize",
      generate: "/api/generate",
    };

    let body;

    if (page === "generate") {
      body = {
        prompt: prompt.trim(),
        language,
      };
    } else if (page === "debug") {
      body = {
        code,
        language,
        auto_fix: true,
      };
    } else {
      body = {
        code,
        language,
      };
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API}${endpoints[page]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail =
          typeof data.detail === "string"
            ? data.detail
            : "Request failed. Please check the API request fields.";

        throw new Error(detail);
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied successfully!");
    } catch {
      alert("Copy failed. Please select and copy the text manually.");
    }
  }

  const outputCode =
    result &&
    (
      result.corrected_code ||
      result.optimized_code ||
      result.generated_code ||
      result.output_code ||
      (page === "generate" ? result.code : "")
    );

  const explanation =
    result &&
    (
      result.analysis ||
      result.explanation ||
      result.reply ||
      result.message ||
      result.suggestions ||
      ""
    );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">{"</>"} CodeFix AI</h2>
        <p className="subtitle">Your AI coding assistant</p>

        <button
          className="new-button"
          onClick={() => {
            setMessages([]);
            setQuestion("");
            setError("");
            setResult(null);
            setPage("chat");
          }}
        >
          + New Chat
        </button>

        <p className="menu-title">WORKSPACE</p>

        <button
          className={page === "chat" ? "nav active" : "nav"}
          onClick={() => changePage("chat")}
        >
          ✳ AI Code Assistant
        </button>

        <button
          className={page === "debug" ? "nav active" : "nav"}
          onClick={() => changePage("debug")}
        >
          ⌘ Code Debugger
        </button>

        <button
          className={page === "explain" ? "nav active" : "nav"}
          onClick={() => changePage("explain")}
        >
          📖 Code Explainer
        </button>

        <button
          className={page === "optimize" ? "nav active" : "nav"}
          onClick={() => changePage("optimize")}
        >
          ⚡ Code Optimizer
        </button>

        <button
          className={page === "generate" ? "nav active" : "nav"}
          onClick={() => changePage("generate")}
        >
          {"</>"} Code Generator
        </button>

        <div className="sidebar-footer">
          <span className="online-dot" /> AI Workspace
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <strong>{pages[page].title}</strong>
            <p>Powered by Groq, LangChain &amp; LangGraph</p>
          </div>
          <span className="status">● AI Assistant</span>
        </header>

        {page === "chat" ? (
          <section className="chat-page">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">✳</div>
                <p className="eyebrow">YOUR AI CODING PARTNER</p>
                <h1>What are we building today?</h1>
                <p className="description">
                  Ask questions, generate programs, fix errors,
                  and learn coding with your AI assistant.
                </p>

                <div className="suggestions">
                  <button onClick={() => changePage("generate")}>
                    <strong>Generate Code</strong>
                    <span>Create a program from your idea</span>
                  </button>

                  <button onClick={() => changePage("debug")}>
                    <strong>Fix an Error</strong>
                    <span>Find and correct coding mistakes</span>
                  </button>

                  <button onClick={() => changePage("explain")}>
                    <strong>Explain Code</strong>
                    <span>Understand how code works</span>
                  </button>

                  <button onClick={() => changePage("optimize")}>
                    <strong>Optimize Code</strong>
                    <span>Improve existing code</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="messages">
                {messages.map((msg, index) => (
                  <article className="message" key={index}>
                    <div className="message-name">
                      {msg.role === "user" ? "You" : "✳ CodeFix AI"}
                    </div>

                    <div className="message-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {String(msg.content ?? "")}
                      </ReactMarkdown>
                    </div>

                    {msg.role === "assistant" && (
                      <button
                        className="copy-button"
                        onClick={() => copyText(msg.content)}
                      >
                        Copy response
                      </button>
                    )}
                  </article>
                ))}

                {loading && (
                  <p className="loading">✳ AI is thinking...</p>
                )}
              </div>
            )}

            {error && <div className="error">{error}</div>}

            <div className="composer">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask CodeFix AI anything about coding..."
                rows={3}
              />

              <div className="composer-bottom">
                <span>Enter to send · Shift + Enter for a new line</span>
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={loading || !question.trim()}
                >
                  {loading ? "..." : "↑ Send"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="debug-page">
            <div className="page-heading">
              <p className="eyebrow">CODEFIX AI TOOLS</p>
              <h1>{pages[page].title}</h1>

              <p>
                {page === "debug" &&
                  "Find errors, understand why they occurred, and get corrected code."}
                {page === "explain" &&
                  "Paste your code to get a beginner-friendly explanation."}
                {page === "optimize" &&
                  "Improve your code and review AI-generated suggestions."}
                {page === "generate" &&
                  "Describe your program and let AI generate the code."}
              </p>
            </div>

            <div className="toolbar">
              <label>
                Language:{" "}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                </select>
              </label>

              <button
                className="analyze-button"
                onClick={runCodeTool}
                disabled={
                  loading ||
                  (page === "generate"
                    ? !prompt.trim()
                    : !code.trim())
                }
              >
                {loading
                  ? "Please wait..."
                  : `✳ ${pages[page].button}`}
              </button>
            </div>

            <div className="editor-panel">
              <div className="panel-title">
                {page === "generate"
                  ? "Describe Your Program"
                  : "</> Your Code"}
              </div>

              <textarea
                className="code-editor"
                value={page === "generate" ? prompt : code}
                onChange={(e) => {
                  if (page === "generate") {
                    setPrompt(e.target.value);
                  } else {
                    setCode(e.target.value);
                  }
                }}
                spellCheck="false"
                placeholder={
                  page === "generate"
                    ? "Example: Create a Python calculator that adds, subtracts, multiplies and divides two numbers."
                    : "Paste your code here..."
                }
              />

              <div className="editor-actions">
                <button
                  onClick={() => {
                    if (page === "generate") {
                      setPrompt("");
                    } else {
                      setCode("");
                    }

                    setResult(null);
                    setError("");
                  }}
                >
                  Clear
                </button>

                {page !== "generate" && (
                  <button onClick={() => copyText(code)}>
                    Copy Source
                  </button>
                )}
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            {result && (
              <div className="results">
                <h2>{pages[page].resultTitle}</h2>

                {explanation && (
                  <div className="result-card">
                    <h3>
                      {page === "debug"
                        ? "Error Explanation"
                        : page === "explain"
                          ? "Code Explanation"
                          : "AI Explanation"}
                    </h3>

                    <div className="result-text markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {String(explanation)}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {outputCode && (
                  <div className="result-card corrected">
                    <h3>
                      {page === "debug"
                        ? "✓ Corrected Code"
                        : page === "optimize"
                          ? "✓ Optimized Code"
                          : "✓ Generated Code"}
                    </h3>

                    <pre className="result-text">
                      <code>{String(outputCode)}</code>
                    </pre>

                    <div className="editor-actions">
                      <button onClick={() => copyText(outputCode)}>
                        Copy Code
                      </button>

                      {page !== "generate" && (
                        <button
                          onClick={() => {
                            setCode(outputCode);
                            setError("");
                          }}
                        >
                          Apply to Editor
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {!explanation && !outputCode && (
                  <div className="result-card">
                    <h3>API Response</h3>
                    <pre className="result-text">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}

                {result.validation_status && (
                  <p className="validation">
                    {result.validation_status}
                  </p>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="empty-result">
                Your results will appear here.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
