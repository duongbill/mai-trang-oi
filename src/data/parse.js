const fs = require('fs');

const raw = `HUYỀN THOẠI
Cơm & xôi
Cơm thịt băm Hambagu
120.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm trà cá hồi Ochazuke
100.000đ

SỬ THI
Lẩu & cháo
Canh sườn bò Galbitang kèm cơm
270.000đ

CỔ VẬT
Bún, phở & mì
Mì Kalguksu hải sản
150.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm gà Kung Pao
95.000đ

SỬ THI
Cơm & xôi
Cơm cuộn trứng Omurice
75.000đ

SỬ THI
Cơm & xôi
Cơm đậu hũ Mapo
80.000đ

SỬ THI
Cơm & xôi
Cơm heo xào gừng Shogayaki
80.000đ

SỬ THI
Bún, phở & mì
Mì Dan Dan Tứ Xuyên
160.000đ

CỔ VẬT
Lẩu & cháo
Cháo thịt nạc trứng bắc thảo
50.000đ

HIẾM
Cơm & xôi
Cơm heo xào cay Jeyuk
100.000đ

SỬ THI
Lẩu & cháo
Gà hầm sâm Samgyetang
250.000đ

CỔ VẬT
Nướng & chiên
Bò bít tết
180.000đ

CỔ VẬT
Bún, phở & mì
Bún thịt nướng
40.000đ

THƯỜNG
Nướng & chiên
Cá hồi áp chảo
190.000đ

CỔ VẬT
Bún, phở & mì
Mì Quảng
50.000đ

HIẾM
Salad & món nhẹ
Salad cá ngừ
110.000đ

HUYỀN THOẠI
Bún, phở & mì
Hủ tiếu
60.000đ

HIẾM
Chay
Salad & món nhẹ
Salad quinoa đậu gà
115.000đ

HUYỀN THOẠI
Bún, phở & mì
Bún măng vịt
60.000đ

HIẾM
Bún, phở & mì
Bún bò Huế
50.000đ

HIẾM
Cơm & xôi
Cơm cá hồi teriyaki
150.000đ

HUYỀN THOẠI
Bún, phở & mì
Bún mọc
60.000đ

HIẾM
Nướng & chiên
Bò lúc lắc
85.000đ

SỬ THI
Cơm & xôi
Poke cá hồi
160.000đ

CỔ VẬT
Bún, phở & mì
Bún mắm
65.000đ

HIẾM
Cơm & xôi
Cơm rang dưa bò
50.000đ

HIẾM
Cơm & xôi
Cơm lươn Nhật
180.000đ

CỔ VẬT
Bún, phở & mì
Bún bò Nam Bộ
70.000đ

SỬ THI
Bún, phở & mì
Mì bò Đài Loan
85.000đ

SỬ THI
Bún, phở & mì
Bún đậu mắm tôm
55.000đ

HIẾM
Cơm & xôi
Cơm bò nướng Hàn
150.000đ

HUYỀN THOẠI
Lẩu & cháo
Lẩu bò cá nhân
160.000đ

CỔ VẬT
Bún, phở & mì
Mì xào giòn
80.000đ

SỬ THI
Bánh mì & cuốn
Bánh cuốn
35.000đ

THƯỜNG
Pizza & pasta
Mì Ý hải sản
160.000đ

CỔ VẬT
Bánh mì & cuốn
Phở cuốn
70.000đ

SỬ THI
Nướng & chiên
Sườn nướng BBQ
230.000đ

CỔ VẬT
Bún, phở & mì
Phở gà
55.000đ

HIẾM
Bún, phở & mì
Bánh đa cua
45.000đ

HIẾM
Pizza & pasta
Pizza hải sản
160.000đ

CỔ VẬT
Bánh mì & cuốn
Bánh xèo
50.000đ

HIẾM
Bún, phở & mì
Miến gà
55.000đ

HIẾM
Bún, phở & mì
Bánh canh giò heo
55.000đ

HIẾM
Bún, phở & mì
Miến lươn
65.000đ

HIẾM
Chay
Bún, phở & mì
Bún chay
35.000đ

THƯỜNG
Lẩu & cháo
Cháo vịt
55.000đ

HIẾM
Lẩu & cháo
Cháo lòng
40.000đ

THƯỜNG
Bún, phở & mì
Bánh hỏi heo quay
50.000đ

HIẾM
Nướng & chiên
Nem nướng
55.000đ

HIẾM
Salad & món nhẹ
Dimsum
130.000đ

HUYỀN THOẠI
Bún, phở & mì
Mì hoành thánh
60.000đ

HIẾM
Pizza & pasta
Mì Ý sốt cà chua & phô mai
170.000đ

CỔ VẬT
Bún, phở & mì
Miến xào
55.000đ

HIẾM
Cơm & xôi
Xôi mặn
35.000đ

THƯỜNG
Nướng & chiên
Bò kho bánh mì
65.000đ

HIẾM
Lẩu & cháo
Cháo gà
45.000đ

HIẾM
Bún, phở & mì
Nui xào bò
50.000đ

HIẾM
Pizza & pasta
Mì Ý cá hồi
230.000đ

CỔ VẬT
Bún, phở & mì
Mì xá xíu
65.000đ

HIẾM
Cơm & xôi
Cơm risotto
260.000đ

CỔ VẬT
Cơm & xôi
Cơm vịt quay
75.000đ

SỬ THI
Pizza & pasta
Mac & cheese
150.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm xá xíu
55.000đ

HIẾM
Pizza & pasta
Mì Ý pesto
170.000đ

CỔ VẬT
Bánh mì & cuốn
Burrito
150.000đ

HUYỀN THOẠI
Bánh mì & cuốn
Bánh mì chảo
45.000đ

HIẾM
Nướng & chiên
Fish & chips
170.000đ

CỔ VẬT
Bánh mì & cuốn
Bánh cuộn gà
80.000đ

SỬ THI
Nướng & chiên
Gà nướng kèm khoai tây
140.000đ

HUYỀN THOẠI
Bánh mì & cuốn
Taco
150.000đ

HUYỀN THOẠI
Bánh mì & cuốn
Burger gà & khoai tây
80.000đ

SỬ THI
Bánh mì & cuốn
Quesadilla
140.000đ

HUYỀN THOẠI
Bún, phở & mì
Mì udon xào
150.000đ

HUYỀN THOẠI
Lẩu & cháo
Lẩu Thái một người
130.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm chiên kimchi
65.000đ

HIẾM
Bánh mì & cuốn
Cà ri Ấn Độ & naan
220.000đ

CỔ VẬT
Pizza & pasta
Gnocchi
130.000đ

HUYỀN THOẠI
Lẩu & cháo
Lẩu sukiyaki một người
220.000đ

CỔ VẬT
Chay
Bánh mì & cuốn
Falafel kèm pita
90.000đ

SỬ THI
Bánh mì & cuốn
Bánh xèo Nhật
90.000đ

SỬ THI
Cơm & xôi
Cơm biryani
190.000đ

CỔ VẬT
Bánh mì & cuốn
Bánh mì kebab
35.000đ

THƯỜNG
Bánh mì & cuốn
Sandwich
80.000đ

SỬ THI
Cơm & xôi
Cơm tấm
70.000đ

SỬ THI
Bún, phở & mì
Phở bò
70.000đ

SỬ THI
Bánh mì & cuốn
Bánh mì
25.000đ

THƯỜNG
Bún, phở & mì
Bún chả
50.000đ

HIẾM
Salad & món nhẹ
Sushi cá hồi
150.000đ

HUYỀN THOẠI
Pizza & pasta
Pizza
100.000đ

SỬ THI
Nướng & chiên
Gà rán
65.000đ

HIẾM
Chay
Cơm & xôi
Cơm chay
35.000đ

THƯỜNG
Cơm & xôi
Bibimbap
65.000đ

HIẾM
Cơm & xôi
Cơm gà Hội An
45.000đ

HIẾM
Cơm & xôi
Cơm cà ri Nhật
90.000đ

SỬ THI
Salad & món nhẹ
Tteokbokki
40.000đ

THƯỜNG
Bún, phở & mì
Ramen
120.000đ

HUYỀN THOẠI
Bún, phở & mì
Udon
85.000đ

SỬ THI
Cơm & xôi
Cơm gà xối mỡ
60.000đ

HIẾM
Salad & món nhẹ
Gỏi cuốn
35.000đ

THƯỜNG
Lẩu & cháo
Cháo sườn
40.000đ

THƯỜNG
Bún, phở & mì
Mì xào bò
60.000đ

HIẾM
Bún, phở & mì
Bún cá
55.000đ

HIẾM
Nướng & chiên
Gà phô mai Hàn Quốc
120.000đ

HUYỀN THOẠI
Cơm & xôi
Canh đậu hũ non kèm cơm
70.000đ

SỬ THI
Bún, phở & mì
Mì vịt tiềm
95.000đ

SỬ THI
Bún, phở & mì
Mì Tom Yum
60.000đ

HIẾM
Cơm & xôi
Kimbap
55.000đ

HIẾM
Bún, phở & mì
Pad Thai
75.000đ

SỬ THI
Chay
Bún, phở & mì
Mì nấm chay
40.000đ

THƯỜNG
Cơm & xôi
Cơm tempura
130.000đ

HUYỀN THOẠI
Bánh mì & cuốn
Burger bò
65.000đ

HIẾM
Chay
Lẩu & cháo
Lẩu nấm chay
120.000đ

HUYỀN THOẠI
Nướng & chiên
Bò né
75.000đ

SỬ THI
Cơm & xôi
Cơm gà trứng Nhật
100.000đ

SỬ THI
Pizza & pasta
Mì Ý bò bằm
80.000đ

SỬ THI
Chay
Salad & món nhẹ
Gỏi cuốn chay
35.000đ

THƯỜNG
Cơm & xôi
Cơm gà teriyaki
85.000đ

SỬ THI
Cơm & xôi
Cơm cà ri Thái
110.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm gà Hải Nam
75.000đ

SỬ THI
Chay
Bánh mì & cuốn
Bánh mì chay
25.000đ

THƯỜNG
Cơm & xôi
Cơm heo chiên xù
95.000đ

SỬ THI
Bún, phở & mì
Mì soba Nhật
110.000đ

HUYỀN THOẠI
Cơm & xôi
Cơm niêu Singapore
85.000đ

SỬ THI
Cơm & xôi
Cơm chiên hải sản
85.000đ

SỬ THI
Cơm & xôi
Cơm cá saba nướng
125.000đ

HUYỀN THOẠI
Cơm & xôi
Canh kimchi kèm cơm
70.000đ

SỬ THI
Cơm & xôi
Cơm bình dân
40.000đ

THƯỜNG
Cơm & xôi
Cơm bò gyudon
90.000đ

SỬ THI
Bún, phở & mì
Mì lạnh Hàn Quốc
95.000đ

SỬ THI
Pizza & pasta
Pizza pepperoni
140.000đ

HUYỀN THOẠI
Bún, phở & mì
Mì tương đen
60.000đ

HIẾM
Bún, phở & mì
Bún riêu
45.000đ

HIẾM
Bánh mì & cuốn
Burger bò phô mai & khoai tây
120.000đ

HUYỀN THOẠI
Bún, phở & mì
Mì cay Hàn Quốc
75.000đ

SỬ THI
Bún, phở & mì
Bánh canh cua
65.000đ

HIẾM
Pizza & pasta
Lasagna bò
160.000đ

CỔ VẬT
Pizza & pasta
Mì Ý sốt kem bacon
115.000đ

HUYỀN THOẠI
Salad & món nhẹ
Salad ức gà
85.000đ

SỬ THI
Bún, phở & mì
Mì trộn Hàn Quốc
60.000đ

HIẾM
Chay
Bánh mì & cuốn
Chole bhature
165.000đ

CỔ VẬT
Chay
Bánh mì & cuốn
Masala dosa
115.000đ

HUYỀN THOẠI
Nướng & chiên
Gà tandoori kèm naan
220.000đ

CỔ VẬT
Chay
Cơm & xôi
Palak paneer kèm cơm
200.000đ

CỔ VẬT`;

const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
const rarities = ['THƯỜNG', 'HIẾM', 'SỬ THI', 'HUYỀN THOẠI', 'CỔ VẬT'];
const categories = ['Cơm & xôi', 'Bún, phở & mì', 'Nướng & chiên', 'Lẩu & cháo', 'Pizza & pasta', 'Bánh mì & cuốn', 'Salad & món nhẹ', 'Chay'];

const foods = [];
let i = 0;
while (i < lines.length) {
  let rarity = 'THƯỜNG';
  if (rarities.includes(lines[i])) {
    rarity = lines[i++];
  }
  const catList = [];
  while (i < lines.length && categories.includes(lines[i])) {
    catList.push(lines[i++]);
  }
  if (i >= lines.length) break;
  const name = lines[i++];
  let price = '';
  if (i < lines.length && lines[i].includes('đ')) {
    price = lines[i++];
  }
  const category = catList.join(' · ') || 'Món ngon';
  foods.push({
    name,
    price,
    rarity,
    category,
  });
}

// Map each category to an icon
function getIcon(category, name) {
  if (name.includes('Gà') || name.includes('gà')) return '🍗';
  if (name.includes('Bò') || name.includes('bò') || name.includes('bít tết')) return '🥩';
  if (name.includes('Cá') || name.includes('cá') || name.includes('hải sản') || name.includes('Sushi') || name.includes('Poke')) return '🍣';
  if (name.includes('Pizza')) return '🍕';
  if (name.includes('Burger')) return '🍔';
  if (name.includes('Mì Ý') || name.includes('pasta') || name.includes('Mac & cheese') || name.includes('Lasagna')) return '🍝';
  if (name.includes('Lẩu') || name.includes('Canh') || name.includes('Cháo') || name.includes('súp')) return '🍲';
  if (name.includes('Phở') || name.includes('Bún') || name.includes('Mì') || name.includes('Miến') || name.includes('Ramen') || name.includes('Udon') || name.includes('Bánh canh') || name.includes('Hủ tiếu')) return '🍜';
  if (name.includes('Bánh mì') || name.includes('Bánh cuốn') || name.includes('Bánh xèo') || name.includes('Taco') || name.includes('Burrito') || name.includes('Sandwich') || name.includes('Quesadilla')) return '🥪';
  if (name.includes('Cơm') || name.includes('Xôi') || name.includes('Bibimbap') || name.includes('Kimbap')) return '🍱';
  if (name.includes('Salad') || name.includes('Gỏi')) return '🥗';
  if (name.includes('Nem') || name.includes('Ốc') || name.includes('Dimsum')) return '🥟';
  return '🍽️';
}

const enriched = foods.map((f, idx) => ({
  id: `food-${idx + 1}`,
  name: f.name,
  price: f.price,
  rarity: f.rarity,
  category: f.category,
  icon: getIcon(f.category, f.name),
  weight: f.name.includes('Gà rán') ? 3 : 1, // X3 TỈ LỆ GÀ RÁN THEO YÊU CẦU CỦA USER!
}));

fs.writeFileSync('src/data/foodCatalog.json', JSON.stringify(enriched, null, 2), 'utf-8');
console.log('Successfully generated foodCatalog.json with', enriched.length, 'items');
console.log('Sample Gà rán:', enriched.find(e => e.name.includes('Gà rán')));
