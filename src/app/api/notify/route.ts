import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const termsSection = data.terms && data.terms.length > 0
      ? `\n📋 <b>Điều khoản đã duyệt:</b>\n        ✅ ${data.terms.join('\n        ✅ ')}\n`
      : '';

    const message = `
🎉 <b>MAI TRANG VỪA CHỐT LỊCH HẸN RỒI!</b> 🎉
━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Ngày hẹn:</b> Tối mai (15/10/2026)
⏰ <b>Giờ hẹn:</b> ${data.time || 'Chưa chọn'}

🍽️ <b>Bữa tối:</b> ${data.food || 'Chưa chọn'}
🎲 <b>Cách chọn món:</b> ${data.foodSelectionMode || 'Chưa rõ'}
🔢 <b>Số lần bấm Random:</b> ${data.spinCount ?? 0} lần

🎯 <b>Hoạt động:</b> ${data.parentActivity || ''}
📍 <b>Chi tiết:</b> ${data.activityDetail || data.activity || 'Chưa chọn'}${termsSection}
━━━━━━━━━━━━━━━━━━━━━━
🚀 <i>Buổi hẹn đầu tiên — lên đồ thật bảnh và chuẩn bị đón người đẹp thôi bạn tôi ơi!</i>
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
