import { useState } from 'react';
import {
  BookOpen,
  Code2,
  Bot,
  GitFork,
  GraduationCap,
  LayoutGrid,
  Columns2,
  Maximize2,
} from 'lucide-react';
import CourseModule from './components/CourseModule';
import CodeModule from './components/CodeModule';
import AgentModule from './components/AgentModule';
import SkillTree from './components/SkillTree';

type TabKey = 'course' | 'code' | 'agent' | 'skill';
type LayoutMode = 'lab' | 'focus' | 'terminal';

const tabs = [
  { key: 'course' as TabKey, label: '课程', icon: <BookOpen size={16} /> },
  { key: 'code' as TabKey, label: '代码', icon: <Code2 size={16} /> },
  { key: 'agent' as TabKey, label: '助手', icon: <Bot size={16} /> },
  { key: 'skill' as TabKey, label: '技能', icon: <GitFork size={16} /> },
];

const layoutModes: { key: LayoutMode; label: string; icon: React.ReactNode }[] = [
  { key: 'lab', label: '三栏', icon: <LayoutGrid size={14} /> },
  { key: 'focus', label: '双栏', icon: <Columns2 size={14} /> },
  { key: 'terminal', label: '单栏', icon: <Maximize2 size={14} /> },
];

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('lab');
  const [activeTab, setActiveTab] = useState<TabKey>('course');

  const renderModule = (key: TabKey) => {
    switch (key) {
      case 'course':
        return <CourseModule />;
      case 'code':
        return <CodeModule />;
      case 'agent':
        return <AgentModule />;
      case 'skill':
        return <SkillTree />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* ====== HEADER: single row ====== */}
      <header className="shrink-0 bg-white border-b border-border">
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text leading-tight">
                试验设计与分析
              </h1>
              <p className="text-[11px] text-text-muted tracking-wide">
                教学辅助平台
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="hidden md:flex items-center px-3 py-1 bg-surface-rounded rounded-full text-[11px] text-text-secondary">
            第一章 · 8/36 节点
          </div>

          {/* Layout switch + tab bar — desktop only */}
          <div className="flex items-center gap-3">
            {/* Tab bar: only show in terminal mode on desktop, always on mobile */}
            <div className={`flex items-center gap-0.5 bg-surface-raised rounded-lg p-0.5 ${
              layoutMode === 'lab' || layoutMode === 'focus' ? 'hidden md:hidden' : 'hidden md:flex'
            }`}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors
                    ${activeTab === t.key
                      ? 'bg-white text-text shadow-sm'
                      : 'text-text-secondary hover:text-text'
                    }
                  `}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Layout mode buttons */}
            <div className="hidden md:flex items-center gap-0.5 bg-surface-raised rounded-lg p-0.5">
              {layoutModes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setLayoutMode(m.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors
                    ${layoutMode === m.key
                      ? 'bg-white text-text shadow-sm'
                      : 'text-text-secondary hover:text-text'
                    }
                  `}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="flex md:hidden px-5 border-t border-border overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0
                ${activeTab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text'
                }
              `}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ====== MAIN ====== */}
      <main className="flex-1 overflow-hidden p-3">
        {/* Mobile: single module */}
        <div className="md:hidden h-full">
          {renderModule(activeTab)}
        </div>

        {/* Desktop LAB mode: 3 columns, no tabs needed */}
        {layoutMode === 'lab' && (
          <div className="hidden md:grid h-full grid-cols-3 gap-3">
            <div className="min-w-0 h-full animate-slide-up stagger-1">
              <CourseModule />
            </div>
            <div className="min-w-0 h-full animate-slide-up stagger-2">
              <CodeModule />
            </div>
            <div className="min-w-0 h-full animate-slide-up stagger-3">
              <AgentModule />
            </div>
          </div>
        )}

        {/* Desktop FOCUS mode: 2 columns */}
        {layoutMode === 'focus' && (
          <div className="hidden md:grid h-full grid-cols-2 gap-3">
            <div className="min-w-0 h-full animate-slide-up stagger-1">
              <CourseModule />
            </div>
            <div className="min-w-0 h-full animate-slide-up stagger-2">
              <CodeModule />
            </div>
          </div>
        )}

        {/* Desktop TERMINAL mode: single main + skill sidebar */}
        {layoutMode === 'terminal' && (
          <div className="hidden md:grid h-full gap-3">
            {activeTab === 'skill' ? (
              <div className="h-full animate-slide-up stagger-1">
                <SkillTree />
              </div>
            ) : (
              <div className="grid grid-cols-4 h-full gap-3">
                <div className="col-span-3 min-w-0 animate-slide-up stagger-1">
                  {renderModule(activeTab)}
                </div>
                <div className="min-w-0 animate-slide-up stagger-2">
                  <SkillTree />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="shrink-0 bg-white border-t border-border px-5 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            在线
          </span>
          <span>学习 8.5 小时</span>
          <span>提交 28 次</span>
          <span>正确率 72%</span>
        </div>
        <div className="text-[11px] text-text-muted">
          Edu-Assist v0.1
        </div>
      </footer>
    </div>
  );
}
