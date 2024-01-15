export class Entrant {
  name: string;
  sName: string;

  id: number;
  constructor(name: string, sName: string, id: number) {
    this.name = name;
    this.sName = sName;
    this.id = id;
  }
}

export class F1DriverEntrant extends Entrant {
  team: string;
  constructor(name: string, sName: string, id: number, team: string) {
    super(name, sName, id);
    this.team = team;
  }
}

export const entrants = {
  drivers: {
    ham: new F1DriverEntrant("Hamilton", "ham", 44, "mer"),
    rus: new F1DriverEntrant("Russell", "rus", 63, "mer"),
    lec: new F1DriverEntrant("Leclerc", "lec", 16, "fer"),
    sai: new F1DriverEntrant("Sainz", "sai", 55, "fer"),
    ver: new F1DriverEntrant("Verstappen", "ver", 1, "rbr"),
    per: new F1DriverEntrant("Perez", "per", 11, "rbr"),
    alo: new F1DriverEntrant("Alonso", "alo", 14, "ast"),
    oco: new F1DriverEntrant("Ocon", "oco", 31, "alp"),
    hul: new F1DriverEntrant("Hulkenberg", "hul", 27, "has"),
    mag: new F1DriverEntrant("Magnussen", "mag", 20, "has"),
    nor: new F1DriverEntrant("Norris", "nor", 4, "mcl"),
    pia: new F1DriverEntrant("Piastri", "pia", 81, "mcl"),
    str: new F1DriverEntrant("Stroll", "str", 18, "ast"),
    bot: new F1DriverEntrant("Bottas", "bot", 77, "alf"),
    zho: new F1DriverEntrant("Zhou", "zho", 24, "alf"),
    tsu: new F1DriverEntrant("Tsunoda", "tsu", 22, "alt"),
    gas: new F1DriverEntrant("Gasly", "gas", 10, "alp"),
    alb: new F1DriverEntrant("Albon", "alb", 23, "wil"),
    ric: new F1DriverEntrant("Riccardo", "ric", 3, "alt"),
    sar: new F1DriverEntrant("Sargeant", "sar", 2, "wil"),
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
