export interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { [key: string]: string };
}

export type Sport = "f1" | "premier_league";
