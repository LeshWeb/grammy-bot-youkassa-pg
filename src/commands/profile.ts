import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import { prisma } from '../prisma.ts';
import { MyContext } from '../types.ts';

export const profile = async (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();
  const user = await prisma.user.findUnique({
    where: {
      telegramId: ctx.from?.id,
    },
  });
  if (!user) {
    return ctx.callbackQuery?.message?.editText(
      'Для доступа к профилю необходимо зарегестрироваться, используя команду /start',
    );
  }

  const registationDate = user.createdAt.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  ctx.callbackQuery?.message?.editText(
    `Здравствуйте, ${user.firstName}! Вы в личном профиле.\nДата регистрации: ${registationDate}\nУ вас еще нету заказов, перейдите во вкладку Товары для покупок.`,
    {
      reply_markup: new InlineKeyboard().text('Вернуться назад', 'backToMenu'),
    },
  );
};
