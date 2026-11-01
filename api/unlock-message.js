const secretMessages = [
  "Breaking news: local superhero is ridiculously cool. Sources say his favourite human is also pretty amazing. ❤️",
  "Reminder from your personal support human: drink water, eat something, and stop pretending you don't need rest.",
  "Your reward for being a certified cutie: one (1) virtual hug. Redeemable whenever you want. 🫂",
  "Spider-Man saves New York. You make my days better. Seems like we're both doing important work.",
  "P.S. You're allowed to have bad days. Even superheroes need someone in their corner. I'm cheering for you, always.",
  "Official Spidey report: 10/10 hero, 11/10 face, questionable levels of stubbornness. Case closed. 😭",
  "Your next mission: keep being you. No upgrades required. (Okay, maybe remember to reply to messages.)",

  "Even when you think you're not doing enough, I see how hard you're trying.",
  "I hope you achieve everything you've ever secretly wished for.",
  "Your efforts matter, even when nobody notices them. I notice.",
  "I hope life gives you a million reasons to smile.",
  "Please take care of yourself, okay? You deserve the same love you give others.",
  "Don't be too hard on yourself. You're doing better than you think.",
  "Bad days don't make it a bad life. Better days are coming.",
  "You don't have to figure everything out today. One step at a time.",
  "Just a reminder: someone out here is rooting for you, always.",
  "I hope you know how much your existence matters.",
  "If today wasn't your day, tomorrow gets another chance. ❤️",
  "You're my favourite notification, even when you send the most random things.",
  "A little reminder that you're someone's favourite human.",
  "You're special to me in ways I probably don't say enough.",
  "Even superheroes need rest. So please take care of yourself, Spidey.",
  "Your friendly neighbourhood reminder: YOU'RE AMAZING.",
  "Every superhero has their difficult chapters. Yours will have beautiful ones too.",
  "Keep swinging, my favourite human. Better days are waiting."
];

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { code } = req.body || {};
  if (!process.env.SECRET_CODE) {
    return res.status(500).json({ error: "Secret unlock is not configured yet." });
  }

  if (typeof code !== "string" || code !== process.env.SECRET_CODE) {
    return res.status(401).json({ error: "That code didn't work. Try again! ❤️" });
  }

  return res.status(200).json({ messages: secretMessages });
};
