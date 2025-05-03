import 'dotenv/config';
import { Bot, GrammyError, HttpError, InlineKeyboard } from 'grammy';
import { hydrate } from '@grammyjs/hydrate';
import { MyContext } from './types.ts';
import {
  start,
  profile,
  products,
  payments,
  telegramSuccessPaymentHandler,
} from './commands/index.ts';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined');
}

const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

// порядок имеет значение вызываем первым после создания бота
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

bot.use(hydrate());

// порядок имеет значение вызываем вторым после создания бота
bot.on(':successful_payment', telegramSuccessPaymentHandler);

bot.command('start', start);

bot.callbackQuery('menu', (ctx) => {
  ctx.answerCallbackQuery();
  ctx.callbackQuery.message?.editText(
    'Вы в главном меню магазина.\nОтсюда вы можете попасть в раздел с товарами и в свой профиль.',
    {
      reply_markup: new InlineKeyboard()
        .text('Товары', 'products')
        .text('Профиль', 'profile'),
    },
  );
});

bot.callbackQuery('backToMenu', (ctx) => {
  ctx.answerCallbackQuery();
  ctx.callbackQuery.message?.editText(
    'Вы в главном меню магазина.\nОтсюда вы можете попасть в раздел с товарами и в свой профиль.',
    {
      reply_markup: new InlineKeyboard()
        .text('Товары', 'products')
        .text('Профиль', 'profile'),
    },
  );
});

bot.callbackQuery('products', products);

bot.callbackQuery('profile', profile);

bot.callbackQuery(/^buyProduct-\d+$/, payments);

bot.on('message:text', (ctx) => {
  ctx.reply(ctx.message.text);
});

// Обработка ошибок согласно документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

async function startBot() {
  try {
    bot.start();
    console.log('Postgres connected. Bot started');
  } catch (error) {
    console.error('Error in startBot:', error);
  }
}

startBot();
