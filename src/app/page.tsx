'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─── DATA ───────────────────────────────────────────────────────────────────
const TIME_OPTIONS = [
  { id: 'sunset', label: 'Chiều tà hoàng hôn (16:30 – 18:30)', icon: '🌇' },
  { id: 'evening', label: 'Buổi tối mát mẻ (19:00 trở đi)', icon: '🌙' },
  { id: 'all', label: 'Rảnh cả buổi chiều đến tối!', icon: '✨' },
];

const MOOD_OPTIONS = [
  { id: 'chill', label: 'Chill chill ngắm cảnh / đi dạo', icon: '🍃' },
  { id: 'quiet', label: 'Trò chuyện, không gian yên tĩnh', icon: '☕' },
  { id: 'fun', label: 'Vui vẻ, khám phá chỗ mới', icon: '🎡' },
];

const FOOD_OPTIONS = [
  { id: 'bbq', label: 'Lẩu / Nướng xèo xèo ấm cúng', img: '🍲' },
  { id: 'asian', label: 'Đồ Hàn / Đồ Nhật thanh nhẹ', img: '🍣' },
  { id: 'street', label: 'Ốc / Nem nướng / Đồ ăn vặt', img: '🍢' },
];

const ACTIVITY_OPTIONS = [
  { id: 'cafe', label: 'Cafe ngắm view phố đêm', icon: '🌃' },
  { id: 'lake', label: 'Đi dạo hồ, ngắm gió, ăn kem', icon: '🍦' },
  { id: 'workshop', label: 'Xem phim / Workshop / Triển lãm', icon: '🎬' },
];

const TERMS_DEFAULT = [
  'Được quyền đổi ý phút chót 😌',
  'Người đi cùng lo xe cộ đưa đón tận nơi 🚗',
  'Chỉ cần mang một chiếc tâm trạng vui vẻ 🌸',
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Selections {
  time: string;
  mood: string;
  food: string;
  customFood: string;
  activity: string;
  terms: string[];
}

// ─── VARIANTS ────────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function SelectCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 cursor-pointer
        ${selected
          ? 'border-pink-400 bg-pink-50 shadow-md shadow-pink-100'
          : 'border-gray-200 bg-white hover:border-pink-200 hover:bg-pink-50/40'
        }`}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-pink-500 font-bold text-lg shrink-0"
        >
          ✓
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i <= current ? '#ec4899' : '#fce7f3',
          }}
          className="h-2 rounded-full"
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── STEP 0: LANDING ─────────────────────────────────────────────────────────
function Step0Landing({ onNext }: { onNext: () => void }) {
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [escaped, setEscaped] = useState(0);

  const escapeButton = useCallback(() => {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 120;
    setBtnPos({ x, y });
    setEscaped((e) => e + 1);
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      {/* Cat sticker */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="text-8xl"
      >
        🐱
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-pink-600">
          Gửi Trang ✨
        </h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-xs mx-auto">
          Cuối tuần này Trang có rảnh không?<br />
          Cùng đi trốn deadline một chút nhé~
        </p>
      </div>

      {escaped >= 3 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-gray-400 italic"
        >
          Bận thật sao? Thôi thôi cố tí nữa nào 🥺
        </motion.p>
      )}

      <div className="flex flex-col items-center gap-4 w-full max-w-xs relative" style={{ minHeight: 120 }}>
        {/* Nút đồng ý */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-lg shadow-lg shadow-pink-200 cursor-pointer"
        >
          Bắt đầu lên kèo 🚀
        </motion.button>

        {/* Nút trốn chạy */}
        <motion.button
          animate={{ x: btnPos.x, y: btnPos.y }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onMouseEnter={escapeButton}
          onTouchStart={escapeButton}
          className="px-6 py-2 rounded-xl border-2 border-gray-200 text-gray-400 text-sm cursor-pointer bg-white/50 select-none"
        >
          Bận rồi 😅
        </motion.button>
      </div>
    </div>
  );
}

// ─── STEP 1: TIME & MOOD ─────────────────────────────────────────────────────
function Step1TimeMood({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-pink-600 mb-1">⏰ Chọn thời gian</h2>
        <p className="text-xs text-gray-400 mb-3">Trang muốn gặp lúc nào?</p>
        <div className="space-y-2">
          {TIME_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={selections.time === opt.id}
              onClick={() => onChange('time', opt.id)}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm text-gray-700">{opt.label}</span>
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-pink-600 mb-1">✨ Vibe hôm đó thế nào?</h2>
        <p className="text-xs text-gray-400 mb-3">Tâm trạng muốn có</p>
        <div className="space-y-2">
          {MOOD_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={selections.mood === opt.id}
              onClick={() => onChange('mood', opt.id)}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm text-gray-700">{opt.label}</span>
            </SelectCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: FOOD & ACTIVITY ─────────────────────────────────────────────────
function Step2FoodActivity({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string) => void;
}) {
  const randomize = () => {
    const food = FOOD_OPTIONS[Math.floor(Math.random() * FOOD_OPTIONS.length)];
    const activity = ACTIVITY_OPTIONS[Math.floor(Math.random() * ACTIVITY_OPTIONS.length)];
    onChange('food', food.id);
    onChange('activity', activity.id);
  };

  return (
    <div className="space-y-6">
      {/* Food */}
      <div>
        <h2 className="text-lg font-bold text-pink-600 mb-1">🍽️ Chiếc bụng muốn gì?</h2>
        <div className="space-y-2">
          {FOOD_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={selections.food === opt.id}
              onClick={() => onChange('food', opt.id)}
            >
              <span className="text-2xl">{opt.img}</span>
              <span className="text-sm text-gray-700">{opt.label}</span>
            </SelectCard>
          ))}
        </div>

        {/* Custom food input */}
        <input
          type="text"
          placeholder="Hoặc Trang đang thèm món gì khác? 🤔"
          value={selections.customFood}
          onChange={(e) => onChange('customFood', e.target.value)}
          className="mt-3 w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-pink-300 bg-white placeholder:text-gray-400"
        />
      </div>

      {/* Activity */}
      <div>
        <h2 className="text-lg font-bold text-pink-600 mb-1">📍 Sau đó mình đi đâu?</h2>
        <div className="space-y-2">
          {ACTIVITY_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={selections.activity === opt.id}
              onClick={() => onChange('activity', opt.id)}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm text-gray-700">{opt.label}</span>
            </SelectCard>
          ))}
        </div>
      </div>

      {/* Random button */}
      <motion.button
        whileTap={{ scale: 0.92, rotate: [0, -10, 10, 0] }}
        onClick={randomize}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-pink-300 text-pink-500 text-sm font-medium cursor-pointer bg-pink-50/50 hover:bg-pink-50"
      >
        🎲 Phân vân quá thì bấm đây — anh chọn hộ!
      </motion.button>
    </div>
  );
}

// ─── STEP 3: CHECKLIST ───────────────────────────────────────────────────────
function Step3Checklist({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string[]) => void;
}) {
  const toggle = (term: string) => {
    const current = selections.terms;
    if (current.includes(term)) {
      onChange('terms', current.filter((t) => t !== term));
    } else {
      onChange('terms', [...current, term]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-pink-600 mb-1">📋 Điều khoản phụ</h2>
        <p className="text-xs text-gray-400 mb-4">
          (Mặc định đã tích hết rồi, Trang bỏ tick nếu không đồng ý nha 😄)
        </p>
        <div className="space-y-3">
          {TERMS_DEFAULT.map((term) => (
            <motion.button
              key={term}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(term)}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 cursor-pointer
                ${selections.terms.includes(term)
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200 bg-white opacity-60'
                }`}
            >
              <span className="text-xl mt-0.5">
                {selections.terms.includes(term) ? '☑️' : '⬜'}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">{term}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-pink-50 rounded-2xl p-4 text-center">
        <p className="text-sm text-pink-500 font-medium">
          {selections.terms.length === TERMS_DEFAULT.length
            ? '🎉 Đã đọc và đồng ý tất cả! Gần xong rồi~'
            : `Đã chốt ${selections.terms.length}/${TERMS_DEFAULT.length} điều khoản`}
        </p>
      </div>
    </div>
  );
}

// ─── STEP 4: BOARDING PASS ───────────────────────────────────────────────────
function Step4Ticket({
  selections,
  onSubmit,
  submitting,
  done,
}: {
  selections: Selections;
  onSubmit: () => void;
  submitting: boolean;
  done: boolean;
}) {
  const timeLabel = TIME_OPTIONS.find((t) => t.id === selections.time)?.label || '—';
  const moodLabel = MOOD_OPTIONS.find((m) => m.id === selections.mood)?.label || '—';
  const foodLabel = FOOD_OPTIONS.find((f) => f.id === selections.food)?.label || '—';
  const actLabel = ACTIVITY_OPTIONS.find((a) => a.id === selections.activity)?.label || '—';

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-pink-600 text-center">🎫 Vé hẹn hò của Trang</h2>

      {/* Boarding pass */}
      <div className="relative bg-white rounded-3xl shadow-xl shadow-pink-100 overflow-hidden border border-pink-100">
        {/* Top strip */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-400 px-5 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-widest">Hành khách</p>
              <p className="font-bold text-lg">Trang & Anh ✈️</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80 uppercase tracking-widest">Ngày bay</p>
              <p className="font-bold">Cuối tuần này</p>
            </div>
          </div>
        </div>

        {/* Dashed divider with notches */}
        <div className="relative flex items-center py-0">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100" />
          <div className="w-full border-t-2 border-dashed border-pink-200 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100" />
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          {[
            { label: 'Thời gian', value: timeLabel, icon: '⏰' },
            { label: 'Vibe', value: moodLabel, icon: '✨' },
            { label: 'Ăn gì', value: selections.customFood ? `${foodLabel} (+ ${selections.customFood})` : foodLabel, icon: '🍽️' },
            { label: 'Sau đó', value: actLabel, icon: '📍' },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">{row.icon}</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{row.label}</p>
                <p className="text-sm text-gray-700 font-medium leading-snug">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barcode strip */}
        <div className="bg-gray-50 px-5 py-3 flex justify-center">
          <div className="flex gap-0.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-sm"
                style={{
                  width: i % 3 === 0 ? 3 : 1.5,
                  height: i % 5 === 0 ? 28 : 20,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!done ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg shadow-pink-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? '⏳ Đang chốt kèo...' : 'Chốt lịch trình này! 🎉'}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center space-y-2"
        >
          <div className="text-4xl">🎊</div>
          <p className="font-bold text-green-700 text-base">Đã chốt kèo thành công!</p>
          <p className="text-sm text-green-600 leading-relaxed">
            Tin nhắn đã được gửi tới tài xế rồi nha.<br />
            Hẹn gặp Trang cuối tuần này nhé! 🌸
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const TOTAL_STEPS = 5;

export default function Page() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [selections, setSelections] = useState<Selections>({
    time: '',
    mood: '',
    food: '',
    customFood: '',
    activity: '',
    terms: [...TERMS_DEFAULT],
  });

  const handleChange = useCallback(
    (key: keyof Selections, val: string | string[]) => {
      setSelections((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Validate per-step
  const canNext = () => {
    if (step === 1) return !!selections.time && !!selections.mood;
    if (step === 2) return !!selections.food && !!selections.activity;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selections,
          time: TIME_OPTIONS.find((t) => t.id === selections.time)?.label,
          mood: MOOD_OPTIONS.find((m) => m.id === selections.mood)?.label,
          food: FOOD_OPTIONS.find((f) => f.id === selections.food)?.label,
          activity: ACTIVITY_OPTIONS.find((a) => a.id === selections.activity)?.label,
        }),
      });

      if (res.ok) {
        setDone(true);
        // Confetti!
        const fire = (particleRatio: number, opts: object) => {
          confetti({
            origin: { y: 0.7 },
            ...opts,
            particleCount: Math.floor(200 * particleRatio),
          });
        };
        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f9a8d4', '#fbcfe8', '#fce7f3'] });
        fire(0.2, { spread: 60, colors: ['#ec4899', '#f472b6', '#c084fc'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#fde68a', '#fbbf24'] });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45, colors: ['#f9a8d4', '#c084fc'] });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = ['', 'Thời gian & Vibe', 'Ăn gì & Đi đâu', 'Điều khoản', 'Xem vé & Chốt'];

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        {step > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={goBack}
              className="text-pink-400 hover:text-pink-600 text-2xl transition-colors cursor-pointer p-1"
            >
              ←
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Bước {step} / {TOTAL_STEPS - 1}
              </p>
              <p className="text-sm font-semibold text-gray-600">{stepTitles[step]}</p>
            </div>
          </div>
        )}

        {step > 0 && <ProgressDots current={step - 1} total={TOTAL_STEPS - 1} />}

        {/* Step content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 p-6 border border-white overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {step === 0 && <Step0Landing onNext={goNext} />}
              {step === 1 && (
                <Step1TimeMood
                  selections={selections}
                  onChange={(k, v) => handleChange(k, v as string)}
                />
              )}
              {step === 2 && (
                <Step2FoodActivity
                  selections={selections}
                  onChange={(k, v) => handleChange(k, v as string)}
                />
              )}
              {step === 3 && (
                <Step3Checklist
                  selections={selections}
                  onChange={(k, v) => handleChange(k, v as string[])}
                />
              )}
              {step === 4 && (
                <Step4Ticket
                  selections={selections}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  done={done}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next button (for steps 1-3) */}
        {step > 0 && step < 4 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: canNext() ? 1 : 0.4, y: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={!canNext()}
            className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-base shadow-lg shadow-pink-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Xem vé hẹn hò 🎫' : 'Tiếp theo →'}
          </motion.button>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Made with 💗 · Chỉ dành riêng cho Trang
        </p>
      </div>
    </main>
  );
}
