const secretMessages = [
  "Breaking news: local superhero is ridiculously cool. Sources say his favourite human is also pretty amazing. ❤️",
  "Reminder from your personal support human: drink water, eat something, and stop pretending you don't need rest.",
  "Your reward for being a certified cutie: one (1) virtual hug. Redeemable whenever you want. 🫂",
  "Spider-Man saves New York. You make my days better. Seems like we're both doing important work.",
  "P.S. You're allowed to have bad days. Even superheroes need someone in their corner. I'm cheering for you, always.",
  "Official Spidey report: 10/10 hero, 11/10 face, questionable levels of stubbornness. Case closed. 😭",
  "Your next mission: keep being you. No upgrades required. (Okay, maybe remember to reply to messages.)"
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
