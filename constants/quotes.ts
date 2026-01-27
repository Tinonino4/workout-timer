export const motivationalQuotes = [
    "No pain, no gain.",
    "Sweat is just fat crying.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your body can stand almost anything. It’s your mind that you have to convince.",
    "Fitness is not about being better than someone else. It’s about being better than you were yesterday.",
    "The only bad workout is the one that didn't happen.",
    "Discipline is doing what needs to be done, even if you don't want to do it.",
    "Push yourself, because no one else is going to do it for you.",
    "Success starts with self-discipline.",
    "The hard part isn’t getting your body in shape. The hard part is getting your mind in shape.",
    "Champions keep playing until they get it right.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Pain is temporary. Quitting lasts forever.",
    "Every workout moves you one step closer to your goal.",
    "Believe in yourself and you will be unstoppable."
];

export const getRandomQuote = (): string => {
    const index = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[index];
};
