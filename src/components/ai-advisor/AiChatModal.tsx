import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Bot,
  Sparkles,
  Send,
  X,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Scale,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isShariaGuidance?: boolean;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
  const { 
    formatMoney, 
    totalPortfolioValueSAR, 
    shariaHealthScore, 
    zakatReport, 
    selectedRiskProfile 
  } = usePortfolio();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `السلام عليكم ورحمة الله وبركاته! أنا "نماء الذكي"، مستشارك الآلي والشرعي لإدارة الثروات.\n\nمحفظتك الحالية بقيمة **${formatMoney(totalPortfolioValueSAR)}** وبنسبة امتثال شرعي **${shariaHealthScore}%**.\n\nكيف يمكنني مساعدتك اليوم في توضيح أحكام الاستثمار، فلترة الأسهم، أو احتساب الزكاة والتطهير؟`,
      timestamp: 'الآن',
      isShariaGuidance: true,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    'ما هي معايير الفلترة الشرعية في المنصة؟',
    'كيف تم حساب الزكاة السنوية على محفظتي؟',
    'لماذا يتم تطهير أرباح صندوق SPUS؟',
    'هل تملك الذهب هنا حقيقي وقبض شرعي؟',
    'ما الفرق بين المحفظة المتحفظة والمتوازنة؟',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'الآن',
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI dynamic Islamic FinTech response generator
    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('معايير') || lower.includes('فلترة') || lower.includes('aaoifi') || lower.includes('شريعة')) {
        botResponse = `تعتمد منصة "نماء" المعايير الشرعية الصارمة لهيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (**AAOIFI Standard No. 21**):\n\n1. **النشاط التشغيلي (100% مباح)**: استبعاد تام لقطاعات البنوك الربوية، التأمين التقليدي، الخمور، التبغ، القمار، وصناعة الأسلحة.\n2. **نسبة الديون الربوية**: يجب ألا تتجاوز الديون ذات الفائدة 33% من القيمة السوقية للشركة.\n3. **النقدية والاستثمارات الربوية**: يجب ألا تتجاوز الودائع بفائدة 33% من القيمة السوقية.\n4. **الإيرادات العرضية غير النقية**: ألا تتجاوز 5% من إجمالي الإيرادات، مع وجوب تطهيرها وإخراجها للمشاريع الخيرية.\n\nجميع الأصول في محفظتك مراجعة ومجازة من قبل لجان وهيئات شرعية معتمدة.`;
      } else if (lower.includes('زكاة') || lower.includes('حول') || lower.includes('نصاب')) {
        botResponse = `حساب الزكاة في المنصة يتم وفق **معيار الأيوفي الشرعي رقم (35)** لزكاة الشركات والمحافظ:\n\n- **القيمة الخاضعة للزكاة حالياً**: ${formatMoney(zakatReport.zakatableAssetsValueSAR)}\n- **نسبة الزكاة**: 2.5% للحول الهجري (أو 2.577% للميلادي).\n- **الزكاة المستحقة التقديرية**: **${formatMoney(zakatReport.zakatDueAmountSAR)}**\n- **متبقي على اكتمال الحول**: ${zakatReport.daysRemainingInHawl} يوم.\n\nبالنسبة للأسهم طويلة الأجل، تُزكى عن صافي رأس المال العامل (الأصول المتداولة) فقط دون الأصول الثابتة، أما الصكوك والذهب والسيولة فتُزكى بنسبة 100%.`;
      } else if (lower.includes('تطهير') || lower.includes('spus') || lower.includes('أرباح')) {
        botResponse = `تطهير الأرباح (Dividend Purification) هو واجب شرعي لتنقية عوائد الأسهم والصناديق من أي فوائد بنكية عرضية تكتسبها الشركات من ودائعها النقدية.\n\n- في صندوق **SPUS**، تبلغ نسبة الفوائد العرضية قرابة **0.42%** من إجمالي التوزيع النقدي.\n- يقوم المستشار الآلي باحتساب هذا الجزء بدقة وتوفير خيار تحويله تلقائياً أو بنقرة واحدة لصالح الجمعيات الخيرية (مثل منصة إحسان) دون احتساب أجر الصدقة، عملاً بفتوى المجامع الفقهية.`;
      } else if (lower.includes('ذهب') || lower.includes('سبيكة') || lower.includes('قبض')) {
        botResponse = `الذهب في منصة نماء يخضع **لمعيار الأيوفي الشرعي رقم (57) بشأن الذهب وضوابطه**:\n\n✅ **ملك حقيقي ومخصص**: كل وحدة تمثل جرامات حقيقية من سبائك الذهب الخالص عيار 24 (LBMA Certified).\n✅ **قبض حكمي صحيح**: يتم الشراء والتسجيل الفوري دون أي تأجيل في أحد البدلين (خالٍ من ربا النسيئة).\n✅ **بدون رافعة مالية أو بيع على المكشوف**: لا نستخدم أي عقود مشتقات أو تداول هامشي محظور.`;
      } else if (lower.includes('متحفظة') || lower.includes('متوازنة') || lower.includes('فرق') || lower.includes('مخاطر')) {
        botResponse = `الفروق الرئيسية بين الاستراتيجيات الشرعية في المنصة:\n\n1. **المحفظة المتحفظة**: تركز بنسبة 65% على الصكوك السيادية و15% ذهب مادي؛ تناسب من يبحث عن الأمان الكامل وتوزيعات دورية مستقرة بعائد 6.5% - 8.5%.\n2. **المحفظة المتوازنة**: مزيج مثالي (40% أسهم نقية، 30% صكوك، 20% صناديق، 10% ذهب) لتحقيق نمو رأسمالي متوازن بعائد 10.5% - 13.8%.\n3. **محفظة النمو الجريء**: تركز بنسبة 65% على كبرى أسهم التقنية والابتكار النقية لتعظيم العائد المركب بعائد 15% - 21.5% مع استعداد لتذبذب محسوب.`;
      } else {
        botResponse = `شكراً لسؤالك! بخصوص "${query}":\n\nيعمل المستشار الآلي نماء وفق إطار فقهي ومالي متكامل؛ حيث يتم تحليل الفرص الاستثمارية وتوزيع السيولة وفق ضوابط التحوط الإسلامي وتجنب عقود الغرر والجهالة.\n\nهل تود استعراض تفاصيل أصل محدد في محفظتك أو تنفيذ إعادة توازن فورية؟`;
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: 'الآن',
        isShariaGuidance: true,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl h-[85vh] rounded-3xl glass-modal border border-emerald-500/30 flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-100">
                  المستشار المالي والشرعي بالذكاء الاصطناعي
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  AAOIFI متصل
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                إجابات فورية وتحليلات فقهية واستثمارية على مدار الساعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                {msg.sender === 'bot' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    المستشار الذكي
                  </span>
                ) : (
                  <span>أنت</span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md rounded-br-none'
                    : 'bg-white/5 border border-white/10 text-slate-100 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 w-24 text-slate-400 text-xs">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 bg-white/[0.02] border-t border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-[11px] font-medium text-slate-300 hover:text-emerald-300 whitespace-nowrap transition-all flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-background/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك المالي أو الشرعي هنا..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
