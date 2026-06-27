import { useState, useRef, useEffect } from 'react';
import { RiskBadge } from '../components/common';
import {
  Send, Upload, Bot, User, Sparkles,
} from 'lucide-react';

const suggestedPrompts = [
  'Explain this SU53 error',
  'What role covers ME21N?',
  'Is SE16N high risk?',
  'Check SoD conflicts for this user',
];

const mockResponses = {
  'explain this su53 error': `## SU53 Error Analysis

An **SU53 trace** captures the last authorization failure for a user session. When you encounter an SU53 error, it means:

1. **Authorization Object** — The system checked a specific security object (e.g., \`M_BEST_BSA\`)
2. **Field** — A field within that object was evaluated (e.g., \`ACTVT\` = Activity)
3. **Missing Value** — The value your role doesn't contain (e.g., \`01\` = Create)

### How to Read It
- Go to **SU53** in the SAP GUI
- Note the **red entries** — these are the failed checks
- The **Authorization Object** and **Field** tell you what role/permission is missing

### Common Objects
| Object | Module | Meaning |
|--------|--------|---------|
| M_BEST_BSA | MM | Purchase Order access |
| F_BKPF_BUK | FI | Company code posting |
| S_TCODE | Basis | Transaction code check |`,

  'what role covers me21n?': `## ME21N — Create Purchase Order

**T-Code:** ME21N
**Module:** MM (Materials Management)
**Authorization Objects Required:**

| Object | Field | Value | Meaning |
|--------|-------|-------|---------|
| M_BEST_BSA | ACTVT | 01 | Create activity |
| M_BEST_BSA | BSART | * | PO document type |
| M_BEST_EKG | EKGRP | * | Purchasing group |
| M_BEST_EKO | EKORG | * | Purchasing org |

**Recommended Custom Role:** \`Z_MM_PURCHASE_CREATE\`

**Risk Level:** 🟢 LOW — Standard procurement access

> **Note:** Ensure the user's purchasing group and organization are restricted appropriately to maintain least-privilege.`,

  'is se16n high risk?': `## SE16N Risk Assessment

⚠️ **Risk Level: HIGH**

**SE16N** (General Table Display) is classified as **HIGH RISK** because:

1. **Direct Table Access** — Bypasses all application-level security checks
2. **Data Exposure** — Can view sensitive tables like USR02 (passwords), BSEG (financial docs)
3. **Audit Concern** — Auditors specifically flag SE16N access during SOX reviews

### Recommendation
❌ **Do NOT grant SE16N in production** unless absolutely necessary.

### Alternatives
| Instead of | Use |
|-----------|-----|
| SE16N on EKKO/EKPO | ME2M (Purchase Orders Report) |
| SE16N on BSEG/BKPF | FBL1N/FBL3N (Line Items) |
| SE16N on MARA/MARC | MM60 (Material Reports) |

If SE16N is truly required, restrict with **S_TABU_DIS** authorization group.`,

  'check sod conflicts for this user': `## Segregation of Duties (SoD) Check

Analyzing common SoD conflict patterns:

### 🔴 Critical Conflicts Found
| Conflict | T-Codes | Risk | Description |
|----------|---------|------|-------------|
| AP-01 | FB60 + F110 | **HIGH** | Invoice entry + payment run = fraud risk |
| MM-02 | ME21N + MIRO | **MEDIUM** | PO creation + invoice verification |
| MM-03 | ME21N + MIGO | **MEDIUM** | PO creation + goods receipt |

### Recommendations
1. **FB60 + F110**: Remove one access or implement mitigating control (dual approval on payments)
2. **ME21N + MIRO**: Acceptable with compensating controls (approval workflow)
3. **ME21N + MIGO**: Common in small teams, document the business justification

### Mitigating Controls
- Implement **4-eye principle** for financial transactions
- Enable **enhanced audit logging** for these T-Codes
- Schedule **quarterly access reviews**`,
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hello! I'm the **HRRL SAP Authorization AI Assistant**.

I can help you with:
- Analyzing SU53 authorization failures
- Recommending SAP roles for specific T-Codes
- Assessing risk levels for authorization requests
- Checking for Segregation of Duties (SoD) conflicts
- Uploading and analyzing SU53 Excel reports

How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const key = text.toLowerCase().trim();
      const match = Object.keys(mockResponses).find((k) => key.includes(k));
      const response = match
        ? mockResponses[match]
        : `I've analyzed your query about "${text}".

Based on SAP authorization best practices for HPCL HRRL:

1. **Authorization Check**: The system evaluates the relevant authorization objects when executing this transaction
2. **Risk Assessment**: Each authorization carries an inherent risk level based on the sensitivity of data/operations it enables
3. **Recommendation**: Follow the least-privilege principle — only grant the minimum required access

Would you like me to:
- Analyze a specific T-Code in detail?
- Check for SoD conflicts?
- Review an SU53 export file?`;

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);

    const userMsg = { role: 'user', content: `📎 Uploaded: **${file.name}**\n\nPlease analyze this SU53 report.` };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = `## SU53 Report Analysis — ${file.name}

📊 **File parsed successfully** — 24 authorization failures detected.

### Summary Table (Top 5 Failures)

| # | User | T-Code | Auth Object | Field | Missing | Risk |
|---|------|--------|------------|-------|---------|------|
| 1 | EMP001 | ME21N | M_BEST_BSA | ACTVT | 01 | 🟢 LOW |
| 2 | EMP003 | FB60 | F_BKPF_BUK | BUKRS | 1000 | 🔴 HIGH |
| 3 | EMP005 | SE16N | S_TABU_DIS | DICBERCLS | &NC& | 🔴 HIGH |
| 4 | EMP002 | MIRO | M_RECH_BSA | ACTVT | 02 | 🟡 MEDIUM |
| 5 | EMP004 | MIGO | M_MSEG_BWA | BWART | 101 | 🟢 LOW |

### Key Findings
- **3 HIGH risk** failures (FB60, SE16N) — require management approval
- **1 MEDIUM risk** — MIRO access with company code restriction needed
- **2 LOW risk** — Standard business access, auto-approval recommended

### Recommended Actions
1. ❌ **Reject** SE16N access — recommend standard reports
2. ⚠️ **Conditional** FB60 — check SoD with F110 first
3. ✅ **Approve** ME21N, MIGO — standard procurement access

Would you like me to generate role recommendations for each failure?`;

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-[22px] font-medium text-text-primary">AI assistant</h1>
        <p className="text-[13px] text-text-muted mt-1">SAP Authorization expert powered by AI</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-card rounded-[12px] border border-border flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border ${
                msg.role === 'user' ? 'bg-surface text-text-secondary' : 'bg-surface text-accent'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-[18px] h-[18px]" />
                ) : (
                  <Bot className="w-[18px] h-[18px]" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-[12px] px-4 py-3 text-[13px] leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-surface border-border'
                    : 'bg-card border-border'
                }`}
              >
                <div className="prose prose-sm max-w-none prose-slate prose-headings:text-text-primary prose-headings:font-medium prose-p:text-text-secondary prose-strong:font-medium prose-strong:text-text-primary prose-code:text-text-primary prose-code:bg-surface prose-code:px-1 prose-code:rounded prose-table:text-[12px] prose-table:border-collapse prose-td:border-b prose-td:border-border prose-th:text-text-muted prose-th:font-medium">
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h3 key={i} className="text-[15px] mt-3 mb-1">{line.replace('## ', '')}</h3>;
                    if (line.startsWith('### ')) return <h4 key={i} className="text-[14px] mt-2 mb-1">{line.replace('### ', '')}</h4>;
                    if (line.startsWith('| ')) {
                      if (line.startsWith('|---') || line.startsWith('| ---')) return null;
                      const cells = line.split('|').filter(Boolean).map(c => c.trim());
                      return (
                        <div key={i} className="flex gap-2 font-mono py-1 border-b border-border text-[12px] text-text-secondary">
                          {cells.map((cell, j) => (
                            <span key={j} className="flex-1">{cell}</span>
                          ))}
                        </div>
                      );
                    }
                    if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                      return <p key={i} className="ml-2 my-0.5 text-text-secondary">{line}</p>;
                    }
                    if (line.startsWith('> ')) return <blockquote key={i} className="border-l-[3px] border-border pl-3 my-2 text-[12px] italic text-text-muted">{line.replace('> ', '')}</blockquote>;
                    if (line === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="my-1 text-text-secondary">{line.split('**').map((part, pi) => pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part)}</p>;
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                <Bot className="w-[18px] h-[18px] text-accent" />
              </div>
              <div className="bg-card border border-border rounded-[12px] px-4 py-3">
                <div className="flex gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 bg-surface hover:bg-border text-text-secondary text-[12px] rounded-full transition-colors flex items-center gap-1.5 border border-border"
              >
                <Sparkles className="w-[14px] h-[14px] text-text-muted" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4 bg-surface">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-card border border-border hover:bg-surface rounded-lg transition-colors text-text-secondary"
              title="Upload SU53 Excel Report"
            >
              <Upload className="w-[18px] h-[18px]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about SAP authorizations..."
              className="flex-1 px-4 py-2.5 bg-card border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="p-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
