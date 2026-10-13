'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─── DATA CHO BUỔI HẸN ĐẦU TIÊN (Sau 19:00) ──────────────────────────────────
const TIME_OPTIONS = [
  { id: '19h00', label: '19:00 - Chuẩn giờ tan ca thong thả', icon: '🕖' },
  { id: '19h30', label: '19:30 - Tắm rửa lên đồ thật xinh rồi đón', icon: '🌙' },
  { id: '20h00', label: '20:00 - Ăn muộn một chút cho mát mẻ', icon: '✨' },
  { id: 'custom', label: 'Giờ khác (Trang tự chọn)', icon: '⏰' },
];

const MOOD_OPTIONS = [
  { id: 'chill', label: 'Nhẹ nhàng, thư giãn sau ngày làm việc', icon: '🍃' },
  { id: 'quiet', label: 'Không gian ấm cúng để dễ nói chuyện', icon: '☕' },
  { id: 'vibrant', label: 'Vui tươi, nhiều năng lượng cho thoải mái', icon: '🎡' },
];

interface OptionWithSub {
  id: string;
  label: string;
  icon: string;
  suggestions: string[];
}

const FOOD_OPTIONS: OptionWithSub[] = [
  {
    id: 'bbq',
    label: 'Lẩu / Nướng xèo xèo ấm cúng',
    icon: '🍲',
    suggestions: [
      'Gợi ý 1: Quán Nướng A (Không gian chill, đồ tươi)',
      'Gợi ý 2: Lẩu B (Nước lẩu thanh ngọt, ấm bụng)',
      'Gợi ý 3: Quán C (Có bàn riêng tư, dễ nói chuyện)',
    ],
  },
  {
    id: 'asian',
    label: 'Đồ Hàn / Nhật thanh nhẹ, tinh tế',
    icon: '🍣',
    suggestions: [
      'Gợi ý 1: Quán Nhật Sushi & Sashimi A',
      'Gợi ý 2: Quán Hàn Tokbokki & Cơm trộn B',
      'Gợi ý 3: Mì Ramen ấm nóng buổi tối C',
    ],
  },
  {
    id: 'street',
    label: 'Ốc / Đồ ăn vặt / Nem nướng gần gũi',
    icon: '🍢',
    suggestions: [
      'Gợi ý 1: Quán Ốc A (Nước chấm siêu đỉnh)',
      'Gợi ý 2: Nem nướng Nha Trang B',
      'Gợi ý 3: Phố ăn vặt C (Nhiều món vừa ăn vừa trò chuyện)',
    ],
  },
];

const ACTIVITY_OPTIONS: OptionWithSub[] = [
  {
    id: 'cafe',
    label: 'Cafe rooftop ngắm phố đêm',
    icon: '🌃',
    suggestions: [
      'Gợi ý 1: Cafe Ban Công A (View hồ lộng gió)',
      'Gợi ý 2: Cafe Tone Ấm B (Nhạc jazz acoustic êm dịu)',
      'Gợi ý 3: Quán Cafe C (Nhiều góc check-in xinh)',
    ],
  },
  {
    id: 'cinema',
    label: 'Xem phim rạp suất tối',
    icon: '🎬',
    suggestions: [
      'Gợi ý 1: Phim hài tình cảm lãng mạn nhẹ nhàng',
      'Gợi ý 2: Phim hoạt hình Anime chữa lành',
      'Gợi ý 3: Phim bom tấn hành động kịch tính',
    ],
  },
  {
    id: 'walk',
    label: 'Đi dạo hóng gió, ăn kem buôn chuyện',
    icon: '🍦',
    suggestions: [
      'Gợi ý 1: Dạo quanh hồ gió mát',
      'Gợi ý 2: Ghé tiệm kem thủ công Gelato',
      'Gợi ý 3: Đi bộ tuyến phố đêm yên tĩnh',
    ],
  },
];

const TERMS_DEFAULT = [
  'Được quyền đổi ý phút chót mà không bị giận 😌',
  'Dương qua đón tận nơi và chở về an toàn tới cửa 🚗',
  'Chỉ cần mang một chiếc tâm trạng thoải mái nhất 🌸',
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Selections {
  time: string;
  customTime: string;
  mood: string;
  food: string;
  foodDetail: string;
  customFood: string;
  activity: string;
  activityDetail: string;
  terms: string[];
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
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

// ─── PROGRESS DOTS ───────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-5">
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

// ─── STEP 0: LANDING (Buổi hẹn đầu tiên) ──────────────────────────────────────
function Step0Landing({ onNext }: { onNext: () => void }) {
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [escaped, setEscaped] = useState(0);

  const escapeButton = useCallback(() => {
    const x = (Math.random() - 0.5) * 180;
    const y = (Math.random() - 0.5) * 110;
    setBtnPos({ x, y });
    setEscaped((e) => e + 1);
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-5 py-2">
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="text-8xl select-none"
      >
        🐶
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-pink-600">
          Gửi Trang ✨
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
          Sau giờ làm việc cuối tuần này, cùng Dương đi ăn tối và trò chuyện một chút nhé?
        </p>
        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full mt-1">
          🌸 First Date Edition · Lịch sau 7h tối
        </span>
      </div>

      {escaped >= 3 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-pink-500 italic"
        >
          Đừng từ chối mà, Dương chuẩn bị xe cộ chu đáo rồi đó 🥺
        </motion.p>
      )}

      <div className="flex flex-col items-center gap-3 w-full max-w-xs relative mt-2" style={{ minHeight: 110 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-base shadow-lg shadow-pink-200 cursor-pointer"
        >
          Cùng lên lịch hẹn nhé 🚀
        </motion.button>

        <motion.button
          animate={{ x: btnPos.x, y: btnPos.y }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          onMouseEnter={escapeButton}
          onTouchStart={escapeButton}
          className="px-6 py-2 rounded-xl border border-gray-200 text-gray-400 text-xs cursor-pointer bg-white/70 select-none"
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
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">⏰ Giờ đón sau giờ làm</h2>
        <p className="text-xs text-gray-400 mb-2.5">Khoảng thời gian Trang thấy thoải mái nhất (sau 7h tối)</p>
        <div className="space-y-2">
          {TIME_OPTIONS.map((opt) => {
            const isSelected = selections.time === opt.id;
            return (
              <div key={opt.id} className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onChange('time', opt.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer
                    ${isSelected
                      ? 'border-pink-400 bg-pink-50/80 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-pink-200'
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-medium text-gray-700 flex-1">{opt.label}</span>
                  {isSelected && <span className="text-pink-500 font-bold">✓</span>}
                </motion.button>

                {opt.id === 'custom' && isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-2 pr-1 py-1.5 space-y-2.5"
                  >
                    {/* Chip chọn giờ nhanh */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-pink-500 uppercase tracking-wider">
                        ✨ Khung giờ gợi ý (24h):
                      </p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['19:15', '19:45', '20:15', '20:30'].map((quickTime) => {
                          const isQuickActive = selections.customTime.startsWith(quickTime);
                          return (
                            <button
                              key={quickTime}
                              type="button"
                              onClick={() => onChange('customTime', `${quickTime} - Đón Trang`)}
                              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                                isQuickActive
                                  ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-200'
                                  : 'bg-white text-gray-600 border-pink-200 hover:bg-pink-50'
                              }`}
                            >
                              {quickTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bộ chọn Giờ và Phút dạng Stepper Dial tăng giảm siêu cute */}
                    <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-pink-600 font-bold">
                        <span>⏰ Giờ đón chính xác:</span>
                        <span className="text-[10px] bg-pink-200/60 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                          Khung 19h - 23h
                        </span>
                      </div>

                      {/* Hai khối số tăng giảm bóng bẩy */}
                      <div className="flex items-center justify-center gap-3 py-1">
                        {/* Khối Giờ */}
                        {(() => {
                          const currentH = parseInt(selections.customTime.match(/^(\d{2}):/)?.[1] || '19', 10);
                          const currentM = selections.customTime.match(/:(\d{2})/)?.[1] || '15';

                          const updateHour = (delta: number) => {
                            let nextH = currentH + delta;
                            if (nextH < 19) nextH = 23;
                            if (nextH > 23) nextH = 19;
                            onChange('customTime', `${String(nextH).padStart(2, '0')}:${currentM}`);
                          };

                          return (
                            <div className="flex flex-col items-center">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => updateHour(1)}
                                className="w-8 h-6 flex items-center justify-center text-pink-500 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                              >
                                ▲
                              </motion.button>
                              <div className="w-16 h-12 bg-white rounded-2xl border-2 border-pink-300 shadow-sm flex items-center justify-center text-xl font-black text-gray-800">
                                {String(currentH).padStart(2, '0')}
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 font-medium">Giờ</span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => updateHour(-1)}
                                className="w-8 h-6 flex items-center justify-center text-pink-500 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                              >
                                ▼
                              </motion.button>
                            </div>
                          );
                        })()}

                        <span className="text-pink-400 font-black text-2xl -mt-5 animate-pulse">:</span>

                        {/* Khối Phút */}
                        {(() => {
                          const minutesArr = ['00', '15', '30', '45'];
                          const currentH = selections.customTime.match(/^(\d{2}):/)?.[1] || '19';
                          const currentM = selections.customTime.match(/:(\d{2})/)?.[1] || '15';
                          const mIdx = Math.max(0, minutesArr.indexOf(currentM));

                          const updateMin = (delta: number) => {
                            let nextIdx = (mIdx + delta + minutesArr.length) % minutesArr.length;
                            onChange('customTime', `${currentH}:${minutesArr[nextIdx]}`);
                          };

                          return (
                            <div className="flex flex-col items-center">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => updateMin(1)}
                                className="w-8 h-6 flex items-center justify-center text-pink-500 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                              >
                                ▲
                              </motion.button>
                              <div className="w-16 h-12 bg-white rounded-2xl border-2 border-pink-300 shadow-sm flex items-center justify-center text-xl font-black text-gray-800">
                                {currentM}
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 font-medium">Phút</span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => updateMin(-1)}
                                className="w-8 h-6 flex items-center justify-center text-pink-500 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                              >
                                ▼
                              </motion.button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Ô ghi chú thêm */}
                    <input
                      type="text"
                      placeholder="Hoặc nhắn riêng cho Dương (vd: 19h15 đón ở sảnh...)"
                      value={selections.customTime}
                      onChange={(e) => onChange('customTime', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-pink-400 bg-white placeholder:text-gray-400 shadow-xs"
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">✨ Vibe buổi hẹn đầu tiên</h2>
        <p className="text-xs text-gray-400 mb-2.5">Trang muốn không khí thế nào?</p>
        <div className="space-y-2">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = selections.mood === opt.id;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onChange('mood', opt.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer
                  ${isSelected
                    ? 'border-pink-400 bg-pink-50/80 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-pink-200'
                  }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-xs font-medium text-gray-700 flex-1">{opt.label}</span>
                {isSelected && <span className="text-pink-500 font-bold">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: FOOD & ACTIVITY (CÓ GỢI Ý ĐỊA ĐIỂM) ──────────────────────────────
function Step2FoodActivity({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string) => void;
}) {
  const selectedFoodItem = FOOD_OPTIONS.find((f) => f.id === selections.food);
  const selectedActivityItem = ACTIVITY_OPTIONS.find((a) => a.id === selections.activity);

  const randomize = () => {
    const food = FOOD_OPTIONS[Math.floor(Math.random() * FOOD_OPTIONS.length)];
    const act = ACTIVITY_OPTIONS[Math.floor(Math.random() * ACTIVITY_OPTIONS.length)];
    onChange('food', food.id);
    onChange('foodDetail', food.suggestions[0]);
    onChange('activity', act.id);
    onChange('activityDetail', act.suggestions[0]);
  };

  return (
    <div className="space-y-6 max-h-[68vh] overflow-y-auto pr-1">
      {/* 1. Món ăn */}
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">🍽️ Ăn tối món gì ta?</h2>
        <p className="text-xs text-gray-400 mb-2.5">Chọn loại món rồi chọn tiếp gợi ý bên dưới nha</p>
        <div className="space-y-2">
          {FOOD_OPTIONS.map((opt) => {
            const isSelected = selections.food === opt.id;
            return (
              <div key={opt.id} className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange('food', opt.id);
                    if (!opt.suggestions.includes(selections.foodDetail)) {
                      onChange('foodDetail', opt.suggestions[0]);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer
                    ${isSelected
                      ? 'border-pink-400 bg-pink-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-pink-200'
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 flex-1">{opt.label}</span>
                  {isSelected && <span className="text-pink-500 font-bold">✓</span>}
                </motion.button>

                {/* Gợi ý quán a, b, c khi chọn */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 pr-1 py-1 space-y-1.5"
                    >
                      <p className="text-[11px] font-semibold text-pink-500 uppercase tracking-wider">
                        📍 Chọn quán gợi ý:
                      </p>
                      {opt.suggestions.map((sug) => {
                        const isSugSelected = selections.foodDetail === sug;
                        return (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => onChange('foodDetail', sug)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border flex items-center gap-2 cursor-pointer
                              ${isSugSelected
                                ? 'bg-pink-100 border-pink-400 font-medium text-pink-700 shadow-xs'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-pink-50/50'
                              }`}
                          >
                            <span className="text-xs">{isSugSelected ? '💖' : '👉'}</span>
                            <span className="flex-1">{sug}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Ô nhập món khác */}
        <input
          type="text"
          placeholder="Hoặc Trang đang thèm một quán nào khác? ✍️"
          value={selections.customFood}
          onChange={(e) => onChange('customFood', e.target.value)}
          className="mt-3 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-pink-400 bg-white placeholder:text-gray-400"
        />
      </div>

      {/* 2. Đi đâu tiếp theo */}
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">📍 Ăn xong rồi mình đi đâu?</h2>
        <p className="text-xs text-gray-400 mb-2.5">Một chút hoạt động nhẹ nhàng sau bữa tối</p>
        <div className="space-y-2">
          {ACTIVITY_OPTIONS.map((opt) => {
            const isSelected = selections.activity === opt.id;
            return (
              <div key={opt.id} className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange('activity', opt.id);
                    if (!opt.suggestions.includes(selections.activityDetail)) {
                      onChange('activityDetail', opt.suggestions[0]);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer
                    ${isSelected
                      ? 'border-pink-400 bg-pink-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-pink-200'
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 flex-1">{opt.label}</span>
                  {isSelected && <span className="text-pink-500 font-bold">✓</span>}
                </motion.button>

                {/* Gợi ý phim / cafe a, b, c khi chọn */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 pr-1 py-1 space-y-1.5"
                    >
                      <p className="text-[11px] font-semibold text-pink-500 uppercase tracking-wider">
                        📍 Chọn gợi ý chi tiết:
                      </p>
                      {opt.suggestions.map((sug) => {
                        const isSugSelected = selections.activityDetail === sug;
                        return (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => onChange('activityDetail', sug)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border flex items-center gap-2 cursor-pointer
                              ${isSugSelected
                                ? 'bg-pink-100 border-pink-400 font-medium text-pink-700 shadow-xs'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-pink-50/50'
                              }`}
                          >
                            <span className="text-xs">{isSugSelected ? '💖' : '👉'}</span>
                            <span className="flex-1">{sug}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nút random */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={randomize}
        className="w-full py-2.5 rounded-xl border border-dashed border-pink-400 text-pink-500 text-xs font-medium cursor-pointer bg-pink-50/60 hover:bg-pink-100/60"
      >
        🎲 Khó chọn quá? Bấm đây để Dương chọn ngẫu nhiên hộ!
      </motion.button>
    </div>
  );
}

// ─── STEP 3: CHECKLIST ĐIỀU KHOẢN ───────────────────────────────────────────
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
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">📋 Điều khoản buổi hẹn đầu</h2>
        <p className="text-xs text-gray-400 mb-3">
          (Đã bật sẵn, Trang yên tâm là chỉ cần xách túi đi chơi thôi nha 😄)
        </p>
        <div className="space-y-2.5">
          {TERMS_DEFAULT.map((term) => (
            <motion.button
              key={term}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(term)}
              className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer
                ${selections.terms.includes(term)
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200 bg-white opacity-60'
                }`}
            >
              <span className="text-lg mt-0.5">
                {selections.terms.includes(term) ? '☑️' : '⬜'}
              </span>
              <span className="text-xs text-gray-700 leading-relaxed">{term}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-pink-50/80 rounded-2xl p-3.5 text-center">
        <p className="text-xs text-pink-600 font-medium">
          {selections.terms.length === TERMS_DEFAULT.length
            ? '🎉 Đã chốt trọn bộ điều khoản! Giờ thì xem vé thôi nào~'
            : `Đã chốt ${selections.terms.length}/${TERMS_DEFAULT.length} điều khoản`}
        </p>
      </div>
    </div>
  );
}

// ─── STEP 4: BOARDING PASS & CHỐT ĐƠN ────────────────────────────────────────
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
  const selectedTimeObj = TIME_OPTIONS.find((t) => t.id === selections.time);
  const timeLabel = selections.time === 'custom'
    ? (selections.customTime ? `Giờ linh hoạt: ${selections.customTime}` : 'Giờ linh hoạt (Trang chọn sau 19:00)')
    : (selectedTimeObj?.label || '—');
  const moodLabel = MOOD_OPTIONS.find((m) => m.id === selections.mood)?.label || '—';
  const foodItem = FOOD_OPTIONS.find((f) => f.id === selections.food);
  const foodLabel = foodItem?.label || '—';
  const actItem = ACTIVITY_OPTIONS.find((a) => a.id === selections.activity);
  const actLabel = actItem?.label || '—';

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-pink-600 text-center">🎫 Boarding Pass Buổi Hẹn Đầu</h2>

      <div className="relative bg-white rounded-3xl shadow-xl shadow-pink-100 overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] opacity-80 uppercase tracking-widest">Hành khách</p>
              <p className="font-bold text-base">Trang & Dương ✈️</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-80 uppercase tracking-widest">Thời điểm</p>
              <p className="font-bold text-sm">Sau giờ làm tối</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center py-0">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-pink-100" />
          <div className="w-full border-t-2 border-dashed border-pink-200 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-pink-100" />
        </div>

        <div className="px-5 py-4 space-y-3">
          {[
            { label: 'Thời gian đón', value: timeLabel, icon: '⏰' },
            { label: 'Không khí / Vibe', value: moodLabel, icon: '✨' },
            {
              label: 'Ăn tối',
              value: `${foodLabel}${selections.foodDetail ? `\n➥ ${selections.foodDetail}` : ''}${
                selections.customFood ? `\n(Gợi ý thêm: ${selections.customFood})` : ''
              }`,
              icon: '🍽️',
            },
            {
              label: 'Sau bữa tối',
              value: `${actLabel}${selections.activityDetail ? `\n➥ ${selections.activityDetail}` : ''}`,
              icon: '📍',
            },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-2.5">
              <span className="text-base mt-0.5 shrink-0">{row.icon}</span>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{row.label}</p>
                <p className="text-xs text-gray-700 font-medium whitespace-pre-line leading-relaxed">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-5 py-2.5 flex justify-center">
          <div className="flex gap-0.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-sm"
                style={{
                  width: i % 3 === 0 ? 3 : 1.5,
                  height: i % 5 === 0 ? 24 : 16,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {!done ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onSubmit}
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-pink-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? '⏳ Đang gửi lịch cho anh...' : 'Chốt lịch trình này! 🎉'}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center space-y-1.5"
        >
          <div className="text-3xl">🎊</div>
          <p className="font-bold text-green-700 text-sm">Chốt kèo thành công rực rỡ!</p>
          <p className="text-xs text-green-600 leading-relaxed">
            Tin nhắn đã báo về điện thoại của anh rồi nha.<br />
            Hẹn Trang tối hôm đó, chuẩn bị đón người đẹp thôi! 🌸
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
const TOTAL_STEPS = 5;

export default function Page() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [selections, setSelections] = useState<Selections>({
    time: '19h00',
    customTime: '19:15',
    mood: 'quiet',
    food: 'bbq',
    foodDetail: FOOD_OPTIONS[0].suggestions[0],
    customFood: '',
    activity: 'cafe',
    activityDetail: ACTIVITY_OPTIONS[0].suggestions[0],
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

  const canNext = () => {
    if (step === 1) return !!selections.time && !!selections.mood;
    if (step === 2) return !!selections.food && !!selections.activity;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const foodItem = FOOD_OPTIONS.find((f) => f.id === selections.food);
      const actItem = ACTIVITY_OPTIONS.find((a) => a.id === selections.activity);
      const selectedTimeObj = TIME_OPTIONS.find((t) => t.id === selections.time);
      const finalTime = selections.time === 'custom'
        ? (selections.customTime ? `Giờ linh hoạt: ${selections.customTime}` : 'Giờ linh hoạt (sau 19:00)')
        : selectedTimeObj?.label;

      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selections,
          time: finalTime,
          mood: MOOD_OPTIONS.find((m) => m.id === selections.mood)?.label,
          food: foodItem?.label,
          foodDetail: selections.foodDetail,
          activity: actItem?.label,
          activityDetail: selections.activityDetail,
        }),
      });

      if (res.ok) {
        setDone(true);
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

  const stepTitles = ['', 'Giờ hẹn & Vibe', 'Món ăn & Địa điểm', 'Điều khoản', 'Xác nhận vé'];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm my-auto">
        {step > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={goBack}
              className="w-9 h-9 rounded-full bg-white/90 border border-pink-200 text-pink-500 shadow-sm flex items-center justify-center transition-colors hover:bg-pink-50 cursor-pointer shrink-0"
              title="Quay lại"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </motion.button>
            <div className="flex-1">
              <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">
                Bước {step} / {TOTAL_STEPS - 1}
              </p>
              <p className="text-sm font-extrabold text-gray-700">{stepTitles[step]}</p>
            </div>
          </div>
        )}

        {step > 0 && <ProgressDots current={step - 1} total={TOTAL_STEPS - 1} />}

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-pink-100 p-5 border border-white">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
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

        {step > 0 && step < 4 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: canNext() ? 1 : 0.4, y: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={!canNext()}
            className="mt-3.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-lg shadow-pink-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Xem vé hẹn hò 🎫' : 'Tiếp theo →'}
          </motion.button>
        )}

        <p className="text-center text-[11px] text-gray-400 mt-5">
          Made with 💖 · Dành riêng cho Trang
        </p>
      </div>
    </main>
  );
}
