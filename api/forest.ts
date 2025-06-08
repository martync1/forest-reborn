const { MessagingResponse } = require('twilio').twiml;

const forestPaths = {
  '': {
    text: `You awaken in a foggy forest. The trees seem to whisper.\n1. Walk toward the strange light.\n2. Sit down and cry.\n3. Dig in the dirt like a raccoon.`,
    options: ['1', '2', '3']
  },
  '1': {
    text: `The light reveals a moss-covered statue with empty eyes.\n1. Touch its forehead.\n2. Whisper your name.`,
    options: ['1', '2']
  },
  '1-1': {
    text: `A chill runs through you. The statue crumbles. Something stirs behind you.\n1. Turn around.\n2. Run into the trees.`,
    options: ['1', '2']
  },
  '1-2': {
    text: `The statue blinks. It knows your name.\n1. Ask it a question.\n2. Flee.`,
    options: ['1', '2']
  },
  '2': {
    text: `Your sobs echo. A squirrel throws an acorn at you.\n1. Apologize.\n2. Throw it back.`,
    options: ['1', '2']
  },
  '2-1': {
    text: `The squirrel forgives you and leads you to a hidden glade.\n1. Follow it.\n2. Stay and question reality.`,
    options: ['1', '2']
  },
  '2-2': {
    text: `You hit the squirrel. It curses you in perfect Latin. You feel weak.\n1. Beg forgiveness.\n2. Accept your doom.`,
    options: ['1', '2']
  },
  '1-1-1': { text: `You turn. A faceless figure stands there. It offers you tea.\n[The End - Mysterious]`, options: [] },
  '1-1-2': { text: `You trip, fall, and are absorbed by the moss. Nature wins.\n[The End - Tragic]`, options: [] },
  '1-2-1': { text: `The statue tells you a secret: "You never left."\n[The End - Creepy]`, options: [] },
  '1-2-2': { text: `You flee. The forest rearranges. You're back where you started.\n[Looped]`, options: [] },
  '2-1-1': { text: `In the glade, you find peace. Also, a vending machine.\n[The End - Peaceful/Strange]`, options: [] },
  '2-1-2': { text: `You question everything. A raccoon nods knowingly.\n[The End - Philosophical]`, options: [] },
  '2-2-1': { text: `The squirrel forgives you. You transform into a tree.\n[The End - Botanical]`, options: [] },
  '2-2-2': { text: `The curse completes. You fade into the soil.\n[The End - Dramatic]`, options: [] },
  '3': {
    text: `You dig in the dirt with your hands for no reason. A small stone well appears, glowing faintly.\n1. Peer inside.\n2. Toss in a coin.\n3. Say "hello?"`,
    options: ['1', '2', '3']
  },
  '3-1': {
    text: `The well seems bottomless. A breeze escapes it that smells like cinnamon and dread.\n1. Jump in.\n2. Cover it with moss and leave.`,
    options: ['1', '2']
  },
  '3-2': {
    text: `You toss a coin. It never hits bottom. The sound of dripping grows louder until it's the only sound.\n1. Call out.\n2. Run away.`,
    options: ['1', '2']
  },
  '3-3': {
    text: `A voice replies: "Finally." The ground shifts slightly.\n1. Apologize.\n2. Ask who it is.`,
    options: ['1', '2']
  },
  '3-1-1': {
    text: `You fall forever. Eventually you forget falling. Eventually you forget everything.\n[The End - Oblivion]`,
    options: []
  },
  '3-1-2': {
    text: `You cover the well. You feel you’ve averted something. Something ancient. Something unpaid.\n[The End - Responsible]`,
    options: []
  },
  '3-2-1': {
    text: `Your voice echoes forever. You hear someone else repeat it.\nIt's you. From before.\n[The End - Paradoxical]`,
    options: []
  },
  '3-2-2': {
    text: `You flee. You hear footsteps behind you. You don't stop. You *mustn’t* stop.\n[The End - Pursued]`,
    options: []
  },
  '3-3-1': {
    text: `The voice says: "Too late." Your name is unspoken but known.\nYou feel your teeth vibrate.\n[The End - Esoteric]`,
    options: []
  },
  '3-3-2': {
    text: `“I’m you, but different,” it says. “Try harder next time.”\nThe well disappears.\n[The End - Weirdly Motivational]`,
    options: []
  }
};

module.exports = async (req, res) => {
  const twiml = new MessagingResponse();
  const body = req.method === 'POST' ? req.body.Body : req.query.Body || '';
  const digits = body.trim().split(/\s+/);
  let path = '';
  let currentNode = forestPaths[''];

  for (let digit of digits) {
    if (!currentNode || !currentNode.options.includes(digit)) break;
    path = path ? `${path}-${digit}` : digit;
    currentNode = forestPaths[path];
  }

  if (!currentNode) {
    twiml.message(`Invalid path. Text a sequence like "1 2" to play.`);
  } else {
    twiml.message(currentNode.text);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};
