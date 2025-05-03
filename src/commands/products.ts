import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import { MyContext } from '../types';
import { products as prod } from '../consts/products';

export const products = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  const productsList = prod.reduce((acc, product) => {
    return (
      acc +
      `- ${product.name}\nЦена: ${product.price} руб.\nОписание: ${product.description}\n\n`
    );
  }, '');

  const messageText = `Все товары:\n\n${productsList}`;

  const keyboardButtonsRows = prod.map((product) => {
    return InlineKeyboard.text(product.name, `buyProduct-${product.id}`);
  });

  const keyboard = InlineKeyboard.from([
    keyboardButtonsRows,
    [InlineKeyboard.text('Вернуться назад', 'backToMenu')],
  ]);

  ctx.callbackQuery.message?.editText(messageText, {
    reply_markup: keyboard,
  });
};
