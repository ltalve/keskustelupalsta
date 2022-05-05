import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Viestit from "./Viestit";
import { Keskustelu } from "../types";
import format from "date-fns/format";

import {
  Typography,
  Container,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export type YksiKeskusteluInput = {
  keskusteluId: number;
};

interface KeskusteluFromApi {
  keskustelu: Keskustelu;
  virhe: string;
  haettu: boolean;
}

const YksiKeskustelu = (): React.ReactElement => {
  const params = useParams();
  const [KeskusteluFromApi, setKeskusteluFromApi] = useState<KeskusteluFromApi>(
    {
      keskustelu: {
        id: 0,
        otsikko: "",
        sisalto: "",
        kirjoittaja: "",
        aika: "",
      },
      virhe: "",
      haettu: false,
    }
  );

  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch(
        `http://localhost:3107/api/keskustelut/${params.id}`
      );
      if (yhteys.status === 200) {
        setKeskusteluFromApi({
          ...KeskusteluFromApi,
          keskustelu: await yhteys.json(),
          haettu: true,
        });
      } else {
        let virheteksti: string = "";

        switch (yhteys.status) {
          case 404:
            virheteksti = `Palvelimeen ei saada yhteyttä (virhekoodi ${yhteys.status})`;
            break;
          default:
            virheteksti = `Palvelimella tapahtui odottamaton virhe. (virhekoodi ${yhteys.status})`;
            break;
        }

        setKeskusteluFromApi({
          ...KeskusteluFromApi,
          virhe: virheteksti,
          haettu: true,
        });
      }
    } catch (e: any) {
      setKeskusteluFromApi({
        ...KeskusteluFromApi,
        virhe: "Palvelimeen ei saada yhteyttä.",
        haettu: true,
      });
    }
  };

  useEffect(() => {
    apiKutsu();
  }, []);

  if (params.id === undefined) {
    return <></>;
  }

  if (!KeskusteluFromApi.haettu) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (Boolean(KeskusteluFromApi.virhe)) {
    return <Alert severity="error">{KeskusteluFromApi.virhe}</Alert>;
  }

  const formatoiAika = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d.M.y HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <Container sx={{ width: "50%", paddingTop: "30px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        {KeskusteluFromApi.keskustelu.otsikko}
      </Typography>
      <Typography>
        {/* {KeskusteluFromApi.keskustelu.sisalto} */}
        <span
          dangerouslySetInnerHTML={{
            __html: KeskusteluFromApi.keskustelu.sisalto,
          }}
        />
      </Typography>
      <br />
      <Typography
        sx={{
          fontStyle: "italic",
          color: "#777777",
          marginBottom: "10px",
        }}
      >
        {KeskusteluFromApi.keskustelu.kirjoittaja} -{" "}
        {formatoiAika(
          KeskusteluFromApi.keskustelu.aika
            ? KeskusteluFromApi.keskustelu.aika
            : ""
        )}
      </Typography>

      <Viestit keskusteluId={params.id} />
    </Container>
  );
};

export default YksiKeskustelu;
