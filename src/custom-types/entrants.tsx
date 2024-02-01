export class Entrant {
  name: string;
  sName: string;
  id: number;
  color: string;
  constructor(name: string, sName: string, id: number, color: string) {
    this.name = name;
    this.sName = sName;
    this.id = id;
    this.color = color;
  }
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
