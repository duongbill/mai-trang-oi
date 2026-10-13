import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const termsText = data.terms && data.terms.length > 0
      ? data.terms.join('\n        ✅ ')
      : 'Tất cả điều khoản đã đồng ý';

    const message = `
🎉 <b>TRANG VỪA CHỐT LỊCH HẸN RỒI!</b> 🎉
━━━━━━━━━━━━━━━━━━━━━━

⏰ <b>Thời gian:</b> ${data.time || 'Chưa chọn'}
✨ <b>Tâm trạng / Vibe:</b> ${data.mood || 'Chưa chọn'}
🍽️ <b>Món muốn ăn:</b> ${data.food || 'Chưa chọn'}${data.customFood ? `\n   └ Gợi ý thêm: <i>${data.customFood}</i>` : ''}
📍 <b>Địa điểm tiếp theo:</b> ${data.activity || 'Chưa chọn'}

📋 <b>Điều khoản đã chốt:</b>
        ✅ ${termsText}

━━━━━━━━━━━━━━━━━━━━━━
🚀 <i>Lên đồ và chuẩn bị đón người đẹp thôi bro!</i>
    `.trim();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('Missing Telegram credentials');
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Telegram API error: ${errBody}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/notify]', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
