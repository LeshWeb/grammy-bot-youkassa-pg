import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import 'dotenv/config';
import { MyContext } from '../types.ts';
import { products as prod } from '../consts/products.ts';
import { prisma } from '../prisma.ts';

export const payments = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();
  const productId = ctx.callbackQuery.data.split('-')[1];
  const product = prod.find((p) => p.id === parseInt(productId));

  if (!product) {
    return ctx.callbackQuery.message?.editText('Товар не найден');
  }

  try {
    const chatId = ctx.chat?.id;
    if (!chatId) throw new Error('No chat id');

    const providerInvoiceData = {
      receipt: {
        items: [
          {
            description: product.description,
            quantity: 1,
            amount: {
              value: `${product.price}.00`,
              currency: 'RUB',
            },
            vat_code: 1, // уточнить в случае использования
          },
        ],
      },
    };

    ctx.api.sendInvoice(
      chatId,
      product.name,
      product.description,
      product.id.toString(),
      'RUB',
      [{ label: 'Руб', amount: product.price * 100 }],
      {
        provider_token: process.env.PAYMENT_TOKEN,
        need_email: true,
        send_email_to_provider: true,
        provider_data: JSON.stringify(providerInvoiceData),
      },
    );
  } catch (error) {
    console.error('Error in payments:', error);
    ctx.reply('Произошла ошибка при оплате, поддержка: @support_chvk_bot');
  }
};

export const telegramSuccessPaymentHandler = async (ctx: MyContext) => {
  /* console.log(ctx.message?.successful_payment); */

  if (!ctx.message?.successful_payment || !ctx.from) {
    return ctx.reply(
      'Произошла ошибка при оплате, поддержка: @support_chvk_bot',
    );
  }

  const { invoice_payload, total_amount } = ctx.message?.successful_payment;

  const productId = parseInt(invoice_payload);
  const price = total_amount / 100;

  try {
    const user = await prisma.user.findUnique({
      where: {
        telegramId: ctx.from.id,
      },
    });
    if (!user) {
      throw new Error(`${ctx.from.id}: user not found`);
    }
    await prisma.order.create({
      data: {
        userId: user.userId,
        productId,
        price,
      },
    });
    ctx.reply('Спасибо за покупку!', {
      reply_markup: new InlineKeyboard().text('Вернуться назад', 'menu'),
    });
  } catch (error) {
    console.error('Error in payments:', error);
    return ctx.reply(
      'Произошла ошибка при оплате, поддержка: @support_chvk_bot',
    );
  }
};
