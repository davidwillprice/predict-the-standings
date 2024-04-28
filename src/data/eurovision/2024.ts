import {
  Competition,
  Entrant,
  Entrants,
  Round,
} from "@custom-types/game-types";

const predictionFreezeTime = new Date("2024-05-11T22:00:00");

const countries: Entrants = {
  alb: new Entrant("Albania", "alb", "#f00", "black"),
  arm: new Entrant("Armenia", "arm", "#d90012", "#0033a0"),
  asl: new Entrant("Australia", "asl", "#012169", "white"),
  aus: new Entrant("Austria", "aus", "#c8102e", "white"),
  aze: new Entrant("Azerbaijan", "aze", "#00b5e2", "#ef3340"),
  bel: new Entrant("Belgium", "bel", "#f00", "black"),
  cro: new Entrant("Croatia", "cro", "#f00", "black"),
  cyp: new Entrant("Cyprus", "cyp", "#f00", "black"),
  cze: new Entrant("Czechia", "cze", "#f00", "black"),
  den: new Entrant("Denmark", "den", "#f00", "black"),
  est: new Entrant("Estonia", "est", "#f00", "black"),
  fin: new Entrant("Finland", "fin", "#f00", "black"),
  fra: new Entrant("France", "fra", "#f00", "black"),
  geo: new Entrant("Georgia", "geo", "#f00", "black"),
  ger: new Entrant("Germany", "ger", "#f00", "black"),
  gre: new Entrant("Greece", "gre", "#f00", "black"),
  ice: new Entrant("Iceland", "ice", "#f00", "black"),
  ire: new Entrant("Ireland", "ire", "#f00", "black"),
  isr: new Entrant("Israel", "isr", "#f00", "black"),
  ita: new Entrant("Italy", "ita", "#f00", "black"),
  lat: new Entrant("Latvia", "lat", "#f00", "black"),
  lit: new Entrant("Lithuania", "lit", "#f00", "black"),
  lux: new Entrant("Luxembourg", "lux", "#f00", "black"),
  mal: new Entrant("Malta", "mal", "#f00", "black"),
  mol: new Entrant("Moldova", "mol", "#f00", "black"),
  net: new Entrant("Netherlands", "net", "#f00", "black"),
  nor: new Entrant("Norway", "nor", "#f00", "black"),
  pol: new Entrant("Poland", "pol", "#f00", "black"),
  por: new Entrant("Portugal", "por", "#f00", "black"),
  san: new Entrant("San Marino", "san", "#f00", "black"),
  ser: new Entrant("Serbia", "ser", "#f00", "black"),
  slo: new Entrant("Slovenia", "slo", "#f00", "black"),
  swe: new Entrant("Sweden", "swe", "#f00", "black"),
  swi: new Entrant("Switzerland", "swi", "#f00", "black"),
  ukr: new Entrant("Ukraine", "ukr", "#f00", "black"),
  unk: new Entrant("United Kingdom", "unk", "#f00", "black"),
};

let rounds: Round[] = [
  //   new Round("Bahrain GP", {
  //     driver: [
  //       "ver",
  //       "per",
  //       "sai",
  //       "lec",
  //       "rus",
  //       "nor",
  //       "ham",
  //       "pia",
  //       "alo",
  //       "str",
  //       "zho",
  //       "mag",
  //       "ric",
  //       "tsu",
  //       "alb",
  //       "hul",
  //       "oco",
  //       "gas",
  //       "bot",
  //       "sar",
  //     ],
  //     team: ["red", "fer", "mer", "mcl", "ast", "sau", "has", "rb", "wil", "alp"],
  //   }),
];

const competition: Competition = "eurovision";

export const seasonData2024 = {
  allEntrants: { countries: countries },
  competition: competition,
  isSeasonOver: false,
  predictionFreezeTime: predictionFreezeTime,
  rounds: rounds,
};
