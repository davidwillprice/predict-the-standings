import {
  Entrant,
  Entrants,
  LocalSeasonData,
  Round,
} from "@custom-types/game-types";

const drivers: Entrants = {
  gas: new Entrant("Gasly", "gas", "#fa85b9", "#0187da", "#010136"),
  col: new Entrant("Colapinto", "col", "#fa85b9", "#0187da", "#010136"),
  str: new Entrant("Stroll", "str", "#1B8E2D", "#cedc00", "#ffffff"),
  alo: new Entrant("Alonso", "alo", "#1B8E2D", "#cedc00", "#ffffff"),
  bor: new Entrant("Bortoleto", "bor", "#909599", "#afb1a7", "#010136"),
  hul: new Entrant("Hülkenberg", "hul", "#909599", "#afb1a7", "#010136"),
  per: new Entrant("Pérez", "per", "black", "#010136", "#010136"),
  bot: new Entrant("Bottas", "bot", "black", "#010136", "#010136"),
  ham: new Entrant("Hamilton", "ham", "#dc0000", "black", "#ffffff"),
  lec: new Entrant("Leclerc", "lec", "#dc0000", "black", "#ffffff"),
  oco: new Entrant("Ocon", "oco", "#eee", "#010136", "#010136"),
  bea: new Entrant("Bearman", "bea", "#eee", "#010136", "#010136"),
  nor: new Entrant("Norris", "nor", "#ff8700", "#010136", "#010136"),
  pia: new Entrant("Piastri", "pia", "#ff8700", "#010136", "#010136"),
  rus: new Entrant("Russell", "rus", "#00d2be", "#010136", "#010136"),
  ant: new Entrant("Antonelli", "ant", "#00d2be", "#010136", "#010136"),
  law: new Entrant("Lawson", "law", "#00327d", "#ffffff", "#010136"),
  lin: new Entrant("Lindblad", "lin", "#00327d", "#f33c55", "#ffffff"),
  ver: new Entrant("Verstappen", "ver", "#2256ba", "#f33c55", "#ffffff"),
  had: new Entrant("Hadjar", "had", "#2256ba", "#ffffff", "#010136"),
  alb: new Entrant("Albon", "alb", "#37BEDD", "#010136", "#010136"),
  sai: new Entrant("Sainz", "sai", "#37BEDD", "#010136", "#010136"),
};

const teams: Entrants = {
  alp: new Entrant("Alpine", "alp", "#fa85b9", "#0187da", "#010136"),
  ast: new Entrant("Aston Martin", "ast", "#1B8E2D", "#cedc00", "#ffffff"),
  ald: new Entrant("Audi", "ald", "#909599", "#afb1a7", "#010136"),
  cad: new Entrant("Cadillac", "cad", "black", "#010136", "#010136"),
  fer: new Entrant("Ferrari", "fer", "#dc0000", "black", "#ffffff"),
  has: new Entrant("Haas", "has", "#eee", "#010136", "#010136"),
  mcl: new Entrant("McLaren", "mcl", "#ff8700", "#010136", "#010136"),
  mer: new Entrant("Mercedes", "mer", "#00d2be", "#010136", "#010136"),
  rb: new Entrant("Racing Bulls", "rb", "#00327d", "#ffffff", "#010136"),
  red: new Entrant("Red Bull", "red", "#2256ba", "#f33c55", "#ffffff"),
  wil: new Entrant("Williams", "wil", "#37BEDD", "#010136", "#010136"),
};

let rounds: Round[] = [];

const allEntrants = { drivers: drivers, teams: teams };
const id = "2026";
const isGameDataLocked = false;
const isSeasonOver = false;
const predictionFreezeDate = new Date("2026-03-06T01:30:00");
const predictionsOpen = true;

export const seasonData2026 = new LocalSeasonData(
  allEntrants,
  id,
  isGameDataLocked,
  isSeasonOver,
  predictionFreezeDate,
  predictionsOpen,
  rounds,
);
