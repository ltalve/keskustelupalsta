import React from "react";
import { useState, useEffect } from "react";
import { Viesti, ViestitProps } from "../types";
import format from "date-fns/format";

import {
  Typography,
  Container,
  ListItem,
  List,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import UusiViesti from "./UusiViesti";

export interface KeskustelunViestitFromApi {
  viestit: Viesti[];
  virhe: string;
  haettu: boolean;
}

export interface ViestienYhteenveto {
  lkm: number;
  viimeisinPvm: string;
}

const Viestit = (props: ViestitProps): React.ReactElement => {
  const [virheteksti, setVirheteksti] = useState("");

  const [keskustelunViestitFromApi, setKeskustelunViestitFromApi] =
    useState<KeskustelunViestitFromApi>({
      viestit: [],
      virhe: "",
      haettu: false,
    });

  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch(
        `http://localhost:3107/api/keskustelut/${props.keskusteluId}/viestit`
      );
      if (yhteys.status === 200) {
        setKeskustelunViestitFromApi({
          ...keskustelunViestitFromApi,
          viestit: await yhteys.json(),
          haettu: true,
        });
      } else {
        switch (yhteys.status) {
          case 404:
            setVirheteksti(
              `Palvelimeen ei saada yhteyttä (virhekoodi ${yhteys.status})`
            );
            break;
          default:
            setVirheteksti(
              `Palvelimella tapahtui odottamaton virhe. (virhekoodi ${yhteys.status})`
            );
            break;
        }

        setKeskustelunViestitFromApi({
          ...keskustelunViestitFromApi,
          virhe: virheteksti,
          haettu: true,
        });
      }
    } catch (e: any) {
      setKeskustelunViestitFromApi({
        ...keskustelunViestitFromApi,
        virhe: "Palvelimeen ei saada yhteyttä.",
        haettu: true,
      });
    }
  };

  useEffect(() => {
    apiKutsu();
  }, []);

  if (!keskustelunViestitFromApi.haettu) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (Boolean(keskustelunViestitFromApi.virhe)) {
    return <Alert severity="error">{keskustelunViestitFromApi.virhe}</Alert>;
  }

  const formatoiAika = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d.M.y HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <Container sx={{ paddingTop: "30px" }}>
      {keskustelunViestitFromApi.viestit.length > 0 && (
        <>
          <Typography variant="h5">
            Kommentit ({keskustelunViestitFromApi.viestit.length} kpl)
          </Typography>
          <List>
            {keskustelunViestitFromApi.viestit
              ?.sort((a, b) => {
                if (new Date(a.aika) > new Date(b.aika)) {
                  return 1;
                } else if (new Date(a.aika) === new Date(b.aika)) {
                  return 0;
                } else {
                  return -1;
                }
              })
              .map((viesti: Viesti) => (
                <ListItem
                  key={viesti.id}
                  alignItems="flex-start"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      marginTop: "5px",
                    }}
                  >
                    {viesti.sisalto}
                  </Typography>
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: "#777777",
                      marginTop: "5px",
                    }}
                  >
                    {viesti.kirjoittaja} -{" "}
                    {formatoiAika(viesti.aika ? viesti.aika : "")}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </>
      )}
      <UusiViesti haeViestit={apiKutsu} />
      <Typography>{virheteksti}</Typography>
    </Container>
  );
};

export default Viestit;
