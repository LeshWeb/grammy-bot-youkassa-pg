import { InlineKeyboard } from 'grammy';
import { prisma } from '../prisma.ts';
import { MyContext } from '../types.ts';

export const start = async (ctx: MyContext) => {
  if (ctx.from === undefined) {
    return ctx.reply('User info is not available');
  }
  const { id, first_name, username } = ctx.from;
  try {
    const keyboard = new InlineKeyboard().text('Меню', 'menu');
    const existingUser = await prisma.user.findUnique({
      where: {
        telegramId: id,
      },
    });
    if (existingUser) {
      return ctx.reply('Вы уже зарегестрированны', { reply_markup: keyboard });
    }
    const newUser = await prisma.user.create({
      data: {
        telegramId: id,
        username: username ? username : 'Invisible',
        firstName: first_name,
      },
    });
    ctx.reply(`${newUser.firstName}, вы успешно зарегестрированны!`, {
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя');
    ctx.reply('Произошла ошибка при регистрации');
  }
};
