import { Entrant, F1DriverEntrant } from "@app/custom-types/entrants";

interface Entrants {
  drivers: {
    [key: string]: F1DriverEntrant;
  };
  teams: {
    [key: string]: Entrant;
  };
}

export const entrants: Entrants = {
  drivers: {
    ham: new F1DriverEntrant("Hamilton", "ham", 44, "mer", "#00d2be"),
    rus: new F1DriverEntrant("Russell", "rus", 63, "mer", "#00d2be"),
    lec: new F1DriverEntrant("Leclerc", "lec", 16, "fer", "#dc0000"),
    sai: new F1DriverEntrant("Sainz", "sai", 55, "fer", "#dc0000"),
    ver: new F1DriverEntrant("Verstappen", "ver", 1, "rbr", "#00327d"),
    per: new F1DriverEntrant("Perez", "per", 11, "rbr", "#00327d"),
    str: new F1DriverEntrant("Stroll", "str", 18, "ast", "#00584f"),
    alo: new F1DriverEntrant("Alonso", "alo", 14, "ast", "#00584f"),
    gas: new F1DriverEntrant("Gasly", "gas", 10, "alp", "#007acc"),
    oco: new F1DriverEntrant("Ocon", "oco", 31, "alp", "#007acc"),
    hul: new F1DriverEntrant("Hulkenberg", "hul", 27, "has", "black"),
    mag: new F1DriverEntrant("Magnussen", "mag", 20, "has", "black"),
    nor: new F1DriverEntrant("Norris", "nor", 4, "mcl", "#ff8700"),
    pia: new F1DriverEntrant("Piastri", "pia", 81, "mcl", "#ff8700"),
    bot: new F1DriverEntrant("Bottas", "bot", 77, "alf", "#9b0000"),
    zho: new F1DriverEntrant("Zhou", "zho", 24, "alf", "#9b0000"),
    tsu: new F1DriverEntrant("Tsunoda", "tsu", 22, "alt", "#203a54"),
    ric: new F1DriverEntrant("Riccardo", "ric", 3, "alt", "#203a54"),
    alb: new F1DriverEntrant("Albon", "alb", 23, "wil", "#00a0de"),
    sar: new F1DriverEntrant("Sargeant", "sar", 2, "wil", "#00a0de"),
  },
  teams: {
    mer: new Entrant("Mercedes", "mer", 1, "#00d2be"),
    fer: new Entrant("Ferrari", "fer", 2, "#dc0000"),
    rbr: new Entrant("Red Bull", "rbr", 3, "#00327d"),
    mcl: new Entrant("McLaren", "mcl", 4, "#ff8700"),
    alp: new Entrant("Alpine", "alp", 5, "#203a54"),
    alt: new Entrant("Alpha Tauri", "alt", 6, "#203a54"),
    ast: new Entrant("Aston Martin", "ast", 7, "#00584f"),
    has: new Entrant("Haas", "has", 8, "#9b0000"),
    alf: new Entrant("stake", "alf", 9, "#9b0000"),
    wil: new Entrant("Williams", "wil", 10, "#00a0de"),
  },
};
