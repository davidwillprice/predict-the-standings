export class Entrant {
  fName: string;
  sName: string;
  team?: string;
  avgPrePos?: number;
  number: number;
  constructor(fName: string, sName: string, number: number, team?: string) {
    this.fName = fName;
    this.sName = sName;
    this.number = number;
    this.team = team;
  }
}

export const entrants = {
  drivers: {
    ham: new Entrant("Hamilton", "ham", 44, "mer"),
    rus: new Entrant("Russell", "rus", 63, "mer"),
    lec: new Entrant("Leclerc", "lec", 16, "fer"),
    sai: new Entrant("Sainz", "sai", 55, "fer"),
    ver: new Entrant("Verstappen", "ver", 1, "rbr"),
    per: new Entrant("Perez", "per", 11, "rbr"),
    alo: new Entrant("Alonso", "alo", 14, "ast"),
    oco: new Entrant("Ocon", "oco", 31, "alp"),
    hul: new Entrant("Hulkenberg", "hul", 27, "has"),
    mag: new Entrant("Magnussen", "mag", 20, "has"),
    nor: new Entrant("Norris", "nor", 4, "mcl"),
    pia: new Entrant("Piastri", "pia", 81, "mcl"),
    str: new Entrant("Stroll", "str", 18, "ast"),
    bot: new Entrant("Bottas", "bot", 77, "alf"),
    zho: new Entrant("Zhou", "zho", 24, "alf"),
    tsu: new Entrant("Tsunoda", "tsu", 22, "alt"),
    gas: new Entrant("Gasly", "gas", 10, "alp"),
    alb: new Entrant("Albon", "alb", 23, "wil"),
    ric: new Entrant("Riccardo", "ric", 3, "alt"),
    sar: new Entrant("Sargeant", "sar", 2, "wil"),
  },
  teams: {
    mer: new Entrant("Mercedes", "mer", 1),
    fer: new Entrant("Ferrari", "fer", 2),
    rbr: new Entrant("Red Bull", "rbr", 3),
    mcl: new Entrant("McLaren", "mcl", 4),
    alp: new Entrant("Alpine", "alp", 5),
    alt: new Entrant("Alpha Tauri", "alt", 6),
    ast: new Entrant("Aston Martin", "ast", 7),
    has: new Entrant("Haas", "has", 8),
    alf: new Entrant("stake", "alf", 9),
    wil: new Entrant("Williams", "wil", 10),
  },
};
