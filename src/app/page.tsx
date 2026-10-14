'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import FOOD_CATALOG from '@/data/foodCatalog.json';

// ─── DATA CHO BUỔI HẸN ĐẦU TIÊN (Sau 19:00) ──────────────────────────────────
const TIME_SUGGESTIONS = ['19:00', '19:30', '20:00', '20:30'];

// 1. THỰC ĐƠN 144 MÓN & TỈ LỆ GÀ RÁN x3
interface FoodItem {
  id: string;
  name: string;
  price: string;
  rarity: string;
  category: string;
  icon: string;
  weight: number;
}

const ALL_FOODS: FoodItem[] = FOOD_CATALOG as FoodItem[];



// 2. HOẠT ĐỘNG CHÍNH (PARENT) & CHI TIẾT CON (CHILD SUB-OPTIONS)
interface SubOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface ParentActivity {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  vibe: string;
  subOptions: SubOption[];
}

const PARENT_ACTIVITIES: ParentActivity[] = [
  {
    id: 'cafe',
    name: 'Đi Cà phê trò chuyện',
    icon: '☕',
    tagline: 'Không gian ấm cúng, tâm sự nhẹ nhàng',
    vibe: 'Chill chill & Lắng nghe',
    subOptions: [
      {
        id: 'cafe-pho-co',
        title: 'Cafe ban công Phố Cổ',
        desc: 'Ngắm phố xá lên đèn (Loading T, Đinh Cafe)',
        icon: '🏮',
      },
      {
        id: 'cafe-ho-tay',
        title: 'Cafe ven Hồ Tây thoáng mát',
        desc: 'Đón gió đêm, ngắm cảnh (Khu Từ Hoa / Trúc Bạch)',
        icon: '🌊',
      },
      {
        id: 'cafe-cau-giay',
        title: 'Cafe tone ấm Cầu Giấy',
        desc: 'Không gian nhẹ nhàng, yên tĩnh gần nhà',
        icon: '🏡',
      },
    ],
  },
  {
    id: 'movie',
    name: 'Đi Xem phim rạp',
    icon: '🎬',
    tagline: 'Phim hay, bắp rang bơ & thư giãn',
    vibe: 'Gần gũi & Cảm xúc',
    subOptions: [
      {
        id: 'movie-romance',
        title: 'Phim Tình cảm / Lãng mạn',
        desc: 'Ngọt ngào, cảm xúc (đang chiếu rạp)',
        icon: '💖',
      },
      {
        id: 'movie-anime',
        title: 'Phim Hoạt hình / Anime dễ thương',
        desc: 'Hài hước, đáng yêu, nhẹ nhàng dễ xem',
        icon: '🎨',
      },
      {
        id: 'movie-action',
        title: 'Phim Hành động / Gay cấn',
        desc: 'Kịch tính, cuốn hút từng phút giây',
        icon: '🍿',
      },
    ],
  },
  {
    id: 'game',
    name: 'Tô tượng & Chơi game',
    icon: '🎨',
    tagline: 'Cùng nhau tô tượng, chơi game vui vẻ',
    vibe: 'Dễ thương & Tiếng cười',
    subOptions: [
      {
        id: 'game-arcade',
        title: 'Timezone / Dream Games',
        desc: 'Đua xe đối kháng, ném bóng rổ tạo tiếng cười',
        icon: '🕹️',
      },
      {
        id: 'game-claw',
        title: 'Gắp thú bông',
        desc: 'Quyết tâm săn bằng được 1 em gấu đem về tặng Trang',
        icon: '🧸',
      },
      {
        id: 'game-paint',
        title: 'Tô tượng, chơi game',
        desc: 'Vừa tô tượng xinh xắn có kỷ niệm mang về, vừa chơi game giải trí',
        icon: '🎨',
      },
    ],
  },
  {
    id: 'street',
    name: 'Lượn phố hóng gió',
    icon: '🛵',
    tagline: 'Mùa thu Hà Nội se lạnh, lượn xe hóng gió',
    vibe: 'Hóng gió & Thu Hà Nội',
    subOptions: [
      {
        id: 'street-ho-tay',
        title: 'Dạo một vòng Hồ Tây',
        desc: 'Hít thở không khí mát mẻ, ăn kem dừa ngọt mát',
        icon: '🌊',
      },
      {
        id: 'street-hoang-dieu',
        title: 'Lượn qua Hoàng Diệu & Phan Đình Phùng',
        desc: 'Ngắm đường phố rợp bóng cây cổ thụ mùa thu cực thơ',
        icon: '🍂',
      },
      {
        id: 'street-bo-ho',
        title: 'Dạo bộ Bờ Hồ & Nhà Thờ',
        desc: 'Chụp ảnh kỷ niệm trước Nhà Thờ Lớn lung linh',
        icon: '⛪',
      },
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
  food: string;
  customFood: string;
  parentActivity: string;
  activityDetail: string;
  customActivity: string;
  terms: string[];
  spinCount: number;
  isFoodFromSpin: boolean;
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -30 : 30,
    opacity: 0,
  }),
};

// ─── THIN PROGRESS BAR ───────────────────────────────────────────────────────
function ThinProgressBar({ step, total }: { step: number; total: number }) {
  const percent = Math.min(100, Math.max(0, (step / total) * 100));
  return (
    <div className="w-full bg-pink-100/70 h-1.5 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── STEP 0: LANDING (MỞ ĐẦU) ────────────────────────────────────────────────
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
          Mai Trang ơi, đi đâu? ✨
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
          Tối mai (15/10) sau khi Dương đi làm về, cùng Dương đi ăn tối và trò chuyện một chút nhé?
        </p>
        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full mt-1">
          🌸 Buổi Hẹn Đầu Tiên · Tối mai 15/10/2026
        </span>
      </div>

      {escaped >= 1 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-pink-500 font-medium italic"
        >
          Đừng từ chối mà, Dương chuẩn bị cho Mtrang gòi á 🥺
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

// ─── STEP 1: CHỌN MÓN ĂN (144 MÓN & QUAY GACHA x3 GÀ RÁN) ───────────────────
function Step1Food({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: any) => void;
}) {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  const [displaySpinFood, setDisplaySpinFood] = useState<FoodItem>(ALL_FOODS[0]);
  const [spinWinner, setSpinWinner] = useState<FoodItem | null>(null);
  const [highlightedFood, setHighlightedFood] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainCategories = [
    'Tất cả',
    'Cơm & xôi',
    'Bún, phở & mì',
    'Nướng & chiên',
    'Lẩu & cháo',
    'Pizza & pasta',
    'Bánh mì & cuốn',
    'Salad & món nhẹ',
    'Chay',
  ];

  const filteredFoods = ALL_FOODS.filter((item) => {
    const matchSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.category.toLowerCase().includes(search.toLowerCase().trim());
    const matchCategory =
      selectedCategory === 'Tất cả' || item.category.includes(selectedCategory);
    return matchSearch && matchCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / ITEMS_PER_PAGE));
  const currentFoods = filteredFoods.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const spinRandomFood = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinWinner(null);
    setIsSpinModalOpen(true);
    onChange('spinCount', selections.spinCount + 1);

    // Xây dựng danh sách theo trọng số (Gà rán xuất hiện x3 lần ngầm!)
    const weightedPool: FoodItem[] = [];
    ALL_FOODS.forEach((item) => {
      for (let i = 0; i < item.weight; i++) {
        weightedPool.push(item);
      }
    });

    const winner = weightedPool[Math.floor(Math.random() * weightedPool.length)];

    // Nhịp quay: 16 nhịp nhanh (60ms) rồi 7 nhịp giảm tốc dần tạo hiệu ứng hồi hộp như máy quay slot
    const delays = [
      60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
      90, 130, 180, 240, 320, 420, 560
    ];

    let stepIndex = 0;
    const runTick = () => {
      if (stepIndex < delays.length) {
        const randomDish = ALL_FOODS[Math.floor(Math.random() * ALL_FOODS.length)];
        setDisplaySpinFood(randomDish);
        const nextDelay = delays[stepIndex];
        stepIndex++;
        setTimeout(runTick, nextDelay);
      } else {
        // Dừng chính xác ở món thắng cuộc!
        setDisplaySpinFood(winner);
        setSpinWinner(winner);
        setIsSpinning(false);

        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#3b82f6'],
        });
      }
    };

    runTick();
  };

  const handleConfirmSpinWinner = (winner: FoodItem) => {
    onChange('food', winner.name);
    onChange('customFood', '');
    onChange('isFoodFromSpin', true);
    setIsSpinModalOpen(false);

    // Tự chuyển sang tab chứa món đó nếu đang ở tab khác
    let activeCat = selectedCategory;
    if (selectedCategory !== 'Tất cả' && !winner.category.includes(selectedCategory)) {
      setSelectedCategory('Tất cả');
      activeCat = 'Tất cả';
    }

    // Tính toán trang chứa món này và chuyển tới trang đó ngay lập tức
    const pool = ALL_FOODS.filter((item) => {
      return activeCat === 'Tất cả' || item.category.includes(activeCat);
    });
    const winnerIdx = pool.findIndex((f) => f.id === winner.id);
    if (winnerIdx !== -1) {
      const targetPage = Math.floor(winnerIdx / ITEMS_PER_PAGE) + 1;
      setCurrentPage(targetPage);
    }

    setHighlightedFood(winner.name);
    setTimeout(() => {
      setHighlightedFood(null);
    }, 2800);
  };

  return (
    <div className="space-y-3 pb-2 w-full">
      {/* Tiêu đề & Nút quay ngẫu nhiên phụ nhỏ gọn */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-0.5">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-extrabold text-pink-600 flex items-center gap-1.5 truncate">
            <span>🍜</span> Chiếc bụng đói muốn ăn gì?
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
            144 món ngon Hà Nội đã sẵn sàng cho Trang ✨
          </p>
        </div>

        {/* Nút quay ngẫu nhiên phụ (Secondary Button) gọn gàng */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          type="button"
          onClick={spinRandomFood}
          disabled={isSpinning}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 shadow-2xs transition-all cursor-pointer disabled:opacity-60 shrink-0"
          title="Quay ngẫu nhiên món ngon"
        >
          <span className="text-sm">🎲</span>
          <span>Quay ngẫu nhiên</span>
        </motion.button>
      </div>

      {/* Ô NHẬP MÓN RIÊNG (ĐƯA LÊN TRÊN ĐẦU CHO TIỆN) */}
      <div className="bg-gradient-to-r from-pink-50/90 via-rose-50/50 to-pink-50/90 p-2.5 rounded-2xl border border-pink-200/90 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-pink-700 flex items-center gap-1.5">
            <span>✍️</span> Trang thèm món khác? Nhập tại đây nhé:
          </label>
          {selections.customFood && (
            <button
              type="button"
              onClick={() => onChange('customFood', '')}
              className="text-[10px] text-pink-600 hover:text-pink-800 font-bold cursor-pointer"
            >
              Xóa món riêng ✕
            </button>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            🍽️
          </span>
          <input
            type="text"
            placeholder="Ví dụ: Anh 🙈"
            value={selections.customFood}
            onChange={(e) => {
              onChange('customFood', e.target.value);
              onChange('isFoodFromSpin', false);
            }}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-pink-200 text-xs text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-pink-400 shadow-2xs font-medium"
          />
        </div>
        {selections.customFood && (
          <p className="text-[10px] text-pink-600 font-bold flex items-center gap-1 pl-1">
            <span>✓</span> Đang chọn món riêng: &ldquo;{selections.customFood}&rdquo;
          </p>
        )}
      </div>

      {/* Thanh tìm kiếm & Tabs danh mục */}
      <div className="space-y-2 pt-0.5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm món trong thực đơn 144 món..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-pink-200 text-xs text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-pink-400 shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Danh mục lọc nhanh */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {mainCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-pink-500 text-white border-pink-500 shadow-2xs'
                    : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Danh sách món ăn - Được phân trang 6 món / trang (Gọn gàng, không bị kéo dài) */}
      <div className="space-y-1.5 pt-1">
        {currentFoods.length > 0 ? (
          currentFoods.map((item) => {
            const isSelected = selections.food === item.name && !selections.customFood;
            const isHighlighted = highlightedFood === item.name;
            return (
              <button
                key={item.id}
                id={`food-item-${item.id}`}
                type="button"
                onClick={() => {
                  onChange('food', item.name);
                  onChange('customFood', '');
                  onChange('isFoodFromSpin', false);
                }}
                className={`w-full text-left p-2.5 rounded-2xl transition-all border-2 flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-pink-50/95 border-pink-500 ring-2 ring-pink-400/40 shadow-xs'
                    : isHighlighted
                    ? 'bg-pink-100/70 border-pink-400 ring-2 ring-pink-400 animate-pulse'
                    : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-pink-50/40'
                }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs leading-snug block ${
                      isSelected ? 'font-extrabold text-pink-700' : 'font-medium text-gray-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                    {item.category}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-all ${
                    isSelected
                      ? 'bg-pink-500 text-white font-bold ring-2 ring-pink-300 shadow-2xs'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-gray-400 bg-pink-50/20 rounded-2xl border border-dashed border-pink-200">
            Không tìm thấy món &quot;{search}&quot;, Trang thử từ khóa khác hoặc nhập món riêng ở ô phía trên nhé!
          </div>
        )}
      </div>

      {/* Bộ điều khiển phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1.5 px-0.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 disabled:opacity-30 disabled:cursor-not-allowed text-pink-600 text-xs font-bold border border-pink-200 shadow-2xs transition-all cursor-pointer"
          >
            <span>‹</span> Trang trước
          </button>

          <div className="text-[11px] text-gray-500 font-semibold text-center">
            Trang <strong className="text-pink-600">{currentPage}</strong> / {totalPages}
            <span className="text-[10px] text-gray-400 ml-1">({filteredFoods.length} món)</span>
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 disabled:opacity-30 disabled:cursor-not-allowed text-pink-600 text-xs font-bold border border-pink-200 shadow-2xs transition-all cursor-pointer"
          >
            Trang sau <span>›</span>
          </button>
        </div>
      )}

      {/* Popup / Modal quay ngẫu nhiên vui nhộn được portal ra document.body để cố định chính giữa màn hình */}
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {isSpinModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border-2 border-pink-300 text-center space-y-3.5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                      <span className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
                        <span className="text-base">🎰</span> Vòng Quay Ẩm Thực
                      </span>
                      <button
                        type="button"
                        disabled={isSpinning}
                        onClick={() => setIsSpinModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer disabled:opacity-30"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Ô hiển thị món đang quay */}
                    <div className="py-4 px-3 bg-gradient-to-b from-pink-50 to-rose-50/50 rounded-2xl border-2 border-pink-200 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden shadow-inner">
                      {isSpinning && (
                        <div className="absolute top-1.5 right-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-bold animate-pulse">
                          Đang quay...
                        </div>
                      )}
                      <motion.span
                        key={displaySpinFood.name + (isSpinning ? '-spin' : '-win')}
                        initial={isSpinning ? { y: -15, opacity: 0.6 } : { scale: 0.8, opacity: 0 }}
                        animate={isSpinning ? { y: 0, opacity: 1 } : { scale: [1, 1.25, 1], opacity: 1 }}
                        transition={{ duration: isSpinning ? 0.05 : 0.35 }}
                        className="text-5xl mb-1.5 block select-none"
                      >
                        {displaySpinFood.icon}
                      </motion.span>
                      <motion.p
                        key={displaySpinFood.name}
                        className="text-sm font-black text-gray-800 line-clamp-1"
                      >
                        {displaySpinFood.name}
                      </motion.p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{displaySpinFood.category}</p>
                    </div>

                    {spinWinner ? (
                      <div className="space-y-2.5">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 rounded-xl bg-pink-100/90 border-2 border-pink-300 text-xs font-bold text-pink-700 leading-relaxed shadow-xs"
                        >
                          {spinWinner.name.includes('Gà rán')
                            ? '🍗 Gà rán giòn rụm! Vũ trụ mách bảo tối mai ăn món này là chuẩn nhất rồi 😋'
                            : `🎉 Vũ trụ đã chọn: ${spinWinner.name} ✨`}
                        </motion.div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleConfirmSpinWinner(spinWinner)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-200 cursor-pointer active:scale-97 transition-all"
                          >
                            Chốt món này ✨
                          </button>
                          <button
                            type="button"
                            onClick={spinRandomFood}
                            className="py-2.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 font-bold text-xs cursor-pointer active:scale-97 transition-all"
                          >
                            Quay lại 🎲
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1">
                        <p className="text-xs font-bold text-pink-500 flex items-center justify-center gap-1.5 animate-pulse">
                          <span>🎲</span> Đang tìm món ngon cho Trang...
                        </p>
                        <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden mt-2.5">
                          <motion.div
                            className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 h-full rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.7, ease: 'linear' }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}

// ─── STEP 2: CHỌN HOẠT ĐỘNG CHÍNH (PARENT ACTIVITY) ─────────────────────────
function Step2ActivityParent({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string) => void;
}) {
  const handleSelectParent = (activity: ParentActivity) => {
    onChange('parentActivity', activity.id);
    if (!activity.subOptions.some((s) => s.title === selections.activityDetail)) {
      onChange('activityDetail', activity.subOptions[0].title);
    }
  };

  return (
    <div className="space-y-4 pb-2">
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">🎯 Tiếp theo mình làm gì nhỉ?</h2>
        <p className="text-xs text-gray-500 mb-3">
          Ăn no nê rồi thì mình đi đâu tiếp? Trang chọn 1 hoạt động chính nhé ✨
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {PARENT_ACTIVITIES.map((act) => {
          const isSelected = selections.parentActivity === act.id;
          return (
            <motion.button
              key={act.id}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => handleSelectParent(act)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px] relative ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/90 shadow-xs'
                  : 'border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{act.icon}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected
                      ? 'bg-pink-500 text-white shadow-2xs'
                      : 'border-2 border-gray-200 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
              <div>
                <p
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-pink-700' : 'text-gray-800'
                  }`}
                >
                  {act.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{act.vibe}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 3: CHI TIẾT CON TƯƠNG ỨNG (CHILD SUB-OPTIONS) ──────────────────────
function Step3ActivityDetail({
  selections,
  onChange,
  onBackToParent,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: string) => void;
  onBackToParent: () => void;
}) {
  const currentParent =
    PARENT_ACTIVITIES.find((p) => p.id === selections.parentActivity) || PARENT_ACTIVITIES[0];

  return (
    <div className="space-y-3.5 pb-2">
      <div>
        <h2 className="text-base font-bold text-pink-600 mb-0.5">✨ Chi tiết thế này nhé!</h2>
        <p className="text-xs text-gray-500 mb-2.5">
          Chọn chi tiết cụ thể cho buổi hẹn theo đúng gu của Trang nè 💕
        </p>

        {/* Thanh tóm tắt hoạt động đã chọn ở Bước 2 */}
        <div className="bg-pink-50/90 px-3.5 py-2.5 rounded-2xl border border-pink-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentParent.icon}</span>
            <div>
              <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider">
                Hoạt động đã chọn:
              </p>
              <p className="text-xs font-bold text-pink-700">{currentParent.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToParent}
            className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 bg-white hover:bg-pink-100/70 px-2.5 py-1 rounded-xl border border-pink-200 transition-all cursor-pointer shadow-2xs"
          >
            Đổi hoạt động ↺
          </button>
        </div>
      </div>

      {/* Danh sách các Option con tương ứng */}
      <div className="space-y-2">
        {currentParent.subOptions.map((sub, idx) => {
          const isSelected = selections.activityDetail === sub.title && !selections.customActivity;
          return (
            <motion.button
              key={sub.id}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                onChange('activityDetail', sub.title);
                onChange('customActivity', '');
              }}
              className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/90 shadow-xs'
                  : 'border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/30'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-pink-100/70 flex items-center justify-center text-lg shrink-0 mt-0.5">
                {sub.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-pink-100 text-pink-600 font-bold px-1.5 py-0.2 rounded-md">
                    Gợi ý {idx + 1}
                  </span>
                  <span
                    className={`text-xs font-bold ${isSelected ? 'text-pink-700' : 'text-gray-800'}`}
                  >
                    {sub.title}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{sub.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-1 font-bold ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-2xs'
                    : 'border-2 border-gray-200 text-transparent'
                }`}
              >
                ✓
              </div>
            </motion.button>
          );
        })}

        {/* Ô nhập chi tiết riêng */}
        <div className="pt-1.5">
          <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1 mb-1">
            <span>✍️</span> Hoặc ý tưởng riêng của Trang:
          </label>
          <input
            type="text"
            placeholder="Trang muốn đi đâu hay làm gì khác cứ gõ vào đây nhé..."
            value={selections.customActivity}
            onChange={(e) => onChange('customActivity', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-pink-400 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
}

// ─── STEP 4: THỜI GIAN & ĐỊA ĐIỂM ĐÓN ─────────────────────────────────────────
function Step4Time({
  selections,
  onChange,
}: {
  selections: Selections;
  onChange: (key: keyof Selections, val: any) => void;
}) {
  return (
    <div className="space-y-4 pb-2">
      <div className="text-center space-y-1">
        <h2 className="text-base font-bold text-pink-600">⏰ Thời Gian & Đón Nàng</h2>
        <p className="text-xs text-gray-500">Dương sẽ qua đón Trang đúng giờ để kịp bữa tối ấm áp nha</p>
      </div>

      {/* Phần chọn giờ đón & điểm đón */}
      <div className="bg-gradient-to-b from-pink-50/80 to-rose-50/30 p-4 rounded-2xl border border-pink-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between text-xs text-pink-600 font-bold px-1">
          <span>⏰ Giờ đón chính xác (tối mai 15/10):</span>
          <span className="text-[11px] bg-pink-100 text-pink-600 px-2.5 py-0.5 rounded-full font-bold">
            18h - 23h
          </span>
        </div>

        {/* Stepper Dial tăng giảm trực quan */}
        <div className="flex items-center justify-center gap-3 py-1">
          {/* Khối Giờ */}
          {(() => {
            const currentH = parseInt(selections.time.match(/^(\d{2}):/)?.[1] || '19', 10);
            const currentM = selections.time.match(/:(\d{2})/)?.[1] || '30';

            const updateHour = (delta: number) => {
              let nextH = currentH + delta;
              if (nextH < 18) nextH = 23;
              if (nextH > 23) nextH = 18;
              onChange('time', `${String(nextH).padStart(2, '0')}:${currentM}`);
            };

            return (
              <div className="flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  onClick={() => updateHour(1)}
                  className="w-9 h-6 flex items-center justify-center text-pink-500 hover:text-pink-600 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                >
                  ▲
                </motion.button>
                <div className="w-14 h-11 bg-white rounded-xl border border-pink-200 shadow-2xs flex items-center justify-center text-xl font-black text-gray-800">
                  {String(currentH).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 font-semibold">Giờ</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  onClick={() => updateHour(-1)}
                  className="w-9 h-6 flex items-center justify-center text-pink-500 hover:text-pink-600 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                >
                  ▼
                </motion.button>
              </div>
            );
          })()}

          <span className="text-pink-400 font-black text-2xl -mt-4 animate-pulse">:</span>

          {/* Khối Phút */}
          {(() => {
            const currentH = selections.time.match(/^(\d{2}):/)?.[1] || '19';
            const currentM = parseInt(selections.time.match(/:(\d{2})/)?.[1] || '30', 10);

            const updateMin = (delta: number) => {
              let nextM = currentM + delta;
              if (nextM < 0) nextM = 59;
              if (nextM > 59) nextM = 0;
              onChange('time', `${currentH}:${String(nextM).padStart(2, '0')}`);
            };

            return (
              <div className="flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  onClick={() => updateMin(1)}
                  className="w-9 h-6 flex items-center justify-center text-pink-500 hover:text-pink-600 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                >
                  ▲
                </motion.button>
                <div className="w-14 h-11 bg-white rounded-xl border border-pink-200 shadow-2xs flex items-center justify-center text-xl font-black text-gray-800 select-none">
                  {String(currentM).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 font-semibold">Phút</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  onClick={() => updateMin(-1)}
                  className="w-9 h-6 flex items-center justify-center text-pink-500 hover:text-pink-600 font-bold hover:bg-pink-100 rounded-lg cursor-pointer"
                >
                  ▼
                </motion.button>
              </div>
            );
          })()}
        </div>

        {/* Nút bấm nhanh khung giờ */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {TIME_SUGGESTIONS.map((t) => {
            const isActive = selections.time === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange('time', t)}
                className={`py-1.5 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'border-pink-500 bg-pink-100 text-pink-600 shadow-2xs'
                    : 'border-pink-100 bg-white text-gray-700 hover:bg-pink-50'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Điểm đón */}
        <div className="pt-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
              <span>📍</span> Điểm đón:
            </span>
            <span className="text-[10px] text-pink-500 font-medium">(Trang đổi địa chỉ nếu muốn nhé)</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập địa chỉ đón nếu muốn đổi..."
              value={selections.customTime}
              onChange={(e) => onChange('customTime', e.target.value)}
              className="w-full pl-3 pr-20 py-2 rounded-xl border border-pink-200 text-xs text-gray-800 font-medium focus:outline-none focus:border-pink-400 bg-white shadow-2xs"
            />
            {selections.customTime !== 'Kí túc xá AOF' && (
              <button
                type="button"
                onClick={() => onChange('customTime', 'Kí túc xá AOF')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-lg border border-pink-200 cursor-pointer font-medium"
              >
                KTX AOF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 5: XUẤT VÉ HẸN HÒ & CHỐT LỊCH ─────────────────────────────────────
function Step5Ticket({
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
  const currentParent =
    PARENT_ACTIVITIES.find((p) => p.id === selections.parentActivity) || PARENT_ACTIVITIES[0];
  const finalFoodLabel = selections.customFood
    ? `Món riêng Trang chọn: ${selections.customFood}`
    : selections.food;
  const finalActivityLabel = selections.customActivity
    ? `${currentParent.name} ➜ ${selections.customActivity}`
    : `${currentParent.name} ➜ ${selections.activityDetail}`;

  return (
    <div className="space-y-4 pb-2">
      <div className="text-center space-y-1">
        <h2 className="text-base font-bold text-pink-600">🎫 Tấm Vé Buổi Hẹn Đầu Tiên</h2>
        <p className="text-xs text-gray-500">Mọi thứ đã sẵn sàng cho buổi tối tuyệt vời của chúng mình!</p>
      </div>

      {/* Tấm vé Boarding Pass */}
      <div className="relative bg-white rounded-3xl shadow-xl shadow-pink-100 overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-3.5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] opacity-80 uppercase tracking-widest">Hành khách</p>
              <p className="font-bold text-base">Mai Trang & Dương ✈️</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-80 uppercase tracking-widest">Thời điểm</p>
              <p className="font-bold text-sm">Tối mai · 15/10/2026</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center py-0">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-pink-100" />
          <div className="w-full border-t-2 border-dashed border-pink-200 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-pink-100" />
        </div>

        <div className="px-5 py-3.5 space-y-2.5">
          {[
            {
              label: 'Thời gian đón',
              value: `${selections.time || '19:30'} (Dương qua đón tận nơi)\n➥ Điểm đón: ${
                selections.customTime || 'Kí túc xá AOF'
              }`,
              icon: '⏰',
            },
            {
              label: 'Bữa tối',
              value: finalFoodLabel,
              icon: '🍽️',
            },
            {
              label: 'Kế hoạch sau ăn',
              value: finalActivityLabel,
              icon: currentParent.icon,
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

        <div className="bg-gray-50 px-5 py-2 flex justify-center">
          <div className="flex gap-0.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-sm"
                style={{
                  width: i % 3 === 0 ? 3 : 1.5,
                  height: i % 5 === 0 ? 20 : 14,
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
            Hẹn Trang tối mai (15/10), chuẩn bị đón người đẹp thôi! 🌸
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

export default function Page() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [selections, setSelections] = useState<Selections>({
    time: '19:30',
    customTime: 'Kí túc xá AOF',
    food: ALL_FOODS[0].name,
    customFood: '',
    parentActivity: PARENT_ACTIVITIES[0].id,
    activityDetail: PARENT_ACTIVITIES[0].subOptions[0].title,
    customActivity: '',
    terms: [...TERMS_DEFAULT],
    spinCount: 0,
    isFoodFromSpin: false,
  });

  const handleChange = useCallback(
    (key: keyof Selections, val: any) => {
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
    if (step === 1) return !!selections.food || !!selections.customFood;
    if (step === 2) return !!selections.parentActivity;
    if (step === 3) return !!selections.activityDetail || !!selections.customActivity;
    if (step === 4) return !!selections.time;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const currentParent =
        PARENT_ACTIVITIES.find((p) => p.id === selections.parentActivity) || PARENT_ACTIVITIES[0];
      const finalTime = `${selections.time || '19:30'} (Dương qua đón tận nơi)${
        selections.customTime ? ` [Điểm đón: ${selections.customTime}]` : ''
      }`;
      const finalFood = selections.customFood
        ? `${selections.customFood} (Trang chọn riêng)`
        : selections.food;
      const finalActivityDetail = selections.customActivity
        ? `${selections.customActivity} (Trang chọn riêng)`
        : selections.activityDetail;

      let foodSelectionMode = '';
      if (selections.customFood) {
        foodSelectionMode = '✍️ Trang tự gõ món riêng';
      } else if (selections.isFoodFromSpin) {
        foodSelectionMode = `🎲 Chọn qua quay Random (sau ${selections.spinCount} lần bấm quay)`;
      } else {
        if (selections.spinCount > 0) {
          foodSelectionMode = `👆 Trang tự chọn trong danh sách (đã bấm quay thử ${selections.spinCount} lần)`;
        } else {
          foodSelectionMode = '👆 Trang tự chọn trực tiếp (không bấm quay random)';
        }
      }

      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selections,
          time: finalTime,
          food: finalFood,
          parentActivity: currentParent.name,
          activityDetail: finalActivityDetail,
          foodSelectionMode,
          spinCount: selections.spinCount,
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

  const stepTitles = ['', 'Chiếc bụng đói', 'Tiếp theo làm gì?', 'Chi tiết kế hoạch', 'Thời gian đón', 'Tấm vé hẹn hò'];

  return (
    <main className="min-h-screen flex items-center justify-center p-3 sm:p-6 overflow-x-hidden w-full">
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center">
        {/* Khung Phone Card nguyên khối duy nhất */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] shadow-2xl shadow-pink-200/50 border border-pink-100/90 overflow-hidden flex flex-col transition-all">
          {step > 0 && (
            <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100/70 shrink-0">
              <ThinProgressBar step={step} total={TOTAL_STEPS - 1} />
              <div className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={goBack}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-50 border border-pink-200 text-pink-500 shadow-2xs flex items-center justify-center transition-colors hover:bg-pink-100 cursor-pointer shrink-0"
                  title="Quay lại"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
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
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">
                    Bước {step} / {TOTAL_STEPS - 1}
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-800 truncate">{stepTitles[step]}</p>
                </div>
              </div>
            </header>
          )}

          <div className="p-3.5 sm:p-5 flex-1 overflow-x-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="w-full"
              >
                {step === 0 && <Step0Landing onNext={goNext} />}
                {step === 1 && (
                  <Step1Food
                    selections={selections}
                    onChange={(k, v) => handleChange(k, v)}
                  />
                )}
                {step === 2 && (
                  <Step2ActivityParent
                    selections={selections}
                    onChange={(k, v) => handleChange(k, v)}
                  />
                )}
                {step === 3 && (
                  <Step3ActivityDetail
                    selections={selections}
                    onChange={(k, v) => handleChange(k, v)}
                    onBackToParent={() => {
                      setDirection(-1);
                      setStep(2);
                    }}
                  />
                )}
                {step === 4 && (
                  <Step4Time
                    selections={selections}
                    onChange={handleChange}
                  />
                )}
                {step === 5 && (
                  <Step5Ticket
                    selections={selections}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    done={done}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step > 0 && step < 5 && (
            <div className="border-t border-pink-100/70 bg-gradient-to-r from-pink-50/60 via-white to-pink-50/60 p-2.5 sm:p-3 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0 flex-1 pl-1">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Đã chọn:</p>
                <p className="text-xs font-extrabold text-pink-600 truncate max-w-[170px] sm:max-w-[220px]">
                  {step === 1
                    ? selections.customFood || selections.food || 'Chưa chọn món'
                    : step === 2
                    ? PARENT_ACTIVITIES.find((p) => p.id === selections.parentActivity)?.name || ''
                    : step === 3
                    ? selections.customActivity || selections.activityDetail || ''
                    : `${selections.time || '19:30'} · ${selections.customTime || 'KTX AOF'}`}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={goNext}
                disabled={!canNext()}
                className="py-2.5 px-4 sm:py-2.5 sm:px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
              >
                {step === 4 ? 'Xem vé hẹn hò 🎫' : 'Tiếp theo →'}
              </motion.button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          Thiết kế bằng cả trái tim 💖 · Dành riêng cho Mai Trang
        </p>
      </div>
    </main>
  );
}
