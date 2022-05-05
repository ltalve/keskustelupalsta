export interface Keskustelu {
  id: number;
  otsikko: string;
  sisalto: string;
  kirjoittaja: string;
  aika: string;
  viestit?: Viesti[];
}

export interface Viesti {
  id: number;
  keskusteluId: number;
  kirjoittaja: string;
  sisalto: string;
  aika: string;
}

export interface fetchAsetukset {
  method: string;
  headers?: any;
  body?: string;
}

export type ViestitProps = {
  keskusteluId: string;
};
