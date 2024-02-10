export interface User {
  id?: string;
  displayName: string;
  predictions: Entrant[];
}
export interface Users {
  [key: string]: User;
}

export class Entrant {
  name: string;
  sName: string;
  id: number;
  color: string;
  avgPrePos?: number;
  constructor(name: string, sName: string, id: number, color: string) {
    this.name = name;
    this.sName = sName;
    this.id = id;
    this.color = color;
  }
}
export interface Entrants {
  [key: string]: Entrant;
}

export class F1DriverEntrant extends Entrant {
  team: string;
  constructor(
    name: string,
    sName: string,
    id: number,
    team: string,
    color: string
  ) {
    super(name, sName, id, color);
    this.team = team;
  }
}

export class Round {
  trackName;
  standings;
  leaderboards: Leaderboards;
  //entrantDiffTotals: EntrantDiffTotals;
  constructor(trackName: string, driverStandings: Entrant[]) {
    this.trackName = trackName;
    this.standings = driverStandings;
    this.leaderboards = [];
  }
}

interface EntrantDiffTotals {
  entrant: Entrant;
  diffTotal: number;
}
interface Leaderboards {
  // driver: { player: Player; percentCorrect: Number; prevRdDiff: number }[]
  // team: { player: Player; percentCorrect: Number; prevRdDiff: number }[]
}
