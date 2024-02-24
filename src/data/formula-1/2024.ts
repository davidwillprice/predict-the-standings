import { Entrant, Entrants, Round } from "@custom-types/game-types";

const predictionFreezeTime = new Date("2024-02-29T11:30:00");

const drivers: Entrants = {
  ham: new Entrant("Hamilton", "ham", 44, "#00d2be"),
  rus: new Entrant("Russell", "rus", 63, "#00d2be"),
  lec: new Entrant("Leclerc", "lec", 16, "#dc0000"),
  sai: new Entrant("Sainz", "sai", 55, "#dc0000"),
  ver: new Entrant("Verstappen", "ver", 1, "#00327d"),
  per: new Entrant("Perez", "per", 11, "#00327d"),
  str: new Entrant("Stroll", "str", 18, "#1B8E2D"),
  alo: new Entrant("Alonso", "alo", 14, "#1B8E2D"),
  gas: new Entrant("Gasly", "gas", 10, "#fa85b9"),
  oco: new Entrant("Ocon", "oco", 31, "#fa85b9"),
  hul: new Entrant("Hulkenberg", "hul", 27, "#909599"),
  mag: new Entrant("Magnussen", "mag", 20, "#909599"),
  nor: new Entrant("Norris", "nor", 4, "#ff8700"),
  pia: new Entrant("Piastri", "pia", 81, "#ff8700"),
  bot: new Entrant("Bottas", "bot", 77, "#21D800"),
  zho: new Entrant("Zhou", "zho", 24, "#21D800"),
  tsu: new Entrant("Tsunoda", "tsu", 22, "#6654FF"),
  ric: new Entrant("Riccardo", "ric", 3, "#6654FF"),
  alb: new Entrant("Albon", "alb", 23, "#37BEDD"),
  sar: new Entrant("Sargeant", "sar", 2, "#37BEDD"),
};

const teams: Entrants = {
  mer: new Entrant("Mercedes", "mer", 1, "#00d2be"),
  fer: new Entrant("Ferrari", "fer", 2, "#dc0000"),
  red: new Entrant("Red Bull", "red", 3, "#00327d"),
  mcl: new Entrant("McLaren", "mcl", 4, "#ff8700"),
  alp: new Entrant("Alpine", "alp", 5, "#fa85b9"),
  rb: new Entrant("Racing Bulls", "rb", 6, "#6654FF"),
  ast: new Entrant("Aston Martin", "ast", 7, "#1B8E2D"),
  has: new Entrant("Haas", "has", 8, "#909599"),
  sau: new Entrant("Sauber", "sau", 9, "#21D800"),
  wil: new Entrant("Williams", "wil", 10, "#37BEDD"),
};

const {
  ham,
  bot,
  lec,
  sai,
  ver,
  per,
  alo,
  oco,
  hul,
  mag,
  nor,
  pia,
  ric,
  str,
  zho,
  alb,
  tsu,
  gas,
  sar,
  rus,
} = drivers;

const { mer, fer, red, sau, wil, ast, rb, mcl, has, alp } = drivers;

let rounds: Round[] = [
  // new Round("Bahrain GP", {
  //   driver: [
  //     ver,
  //     per,
  //     alo,
  //     sai,
  //     ham,
  //     str,
  //     rus,
  //     bot,
  //     gas,
  //     alb,
  //     tsu,
  //     sar,
  //     mag,
  //     ric,
  //     hul,
  //     zho,
  //     nor,
  //     oco,
  //     lec,
  //     pia,
  //   ],
  //   team: [mer, fer, red, sau, wil, ast, rb, mcl, has, alp],
  // }),
  // new Round("Saudi GP", {
  //   driver: [
  //     ver,
  //     per,
  //     alo,
  //     sai,
  //     ham,
  //     rus,
  //     str,
  //     lec,
  //     bot,
  //     oco,
  //     gas,
  //     mag,
  //     alb,
  //     tsu,
  //     hul,
  //     sar,
  //     zho,
  //     ric,
  //     pia,
  //     nor,
  //   ],
  //   team: [fer, mer, red, sau, mcl, wil, ast, rb, has, alp],
  // }),
];

export const seasonData2024 = {
  rounds: rounds,
  drivers: drivers,
  teams: teams,
  predictionFreezeTime: predictionFreezeTime,
};
