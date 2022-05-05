import React from "react";
import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Keskustelu } from "../types";
import format from "date-fns/format";

import {
  Typography,
  Container,
  ListItem,
  List,
  Button,
  Alert,
  Backdrop,
  CircularProgress,
  Link,
} from "@mui/material";

interface KeskustelutFromApi {
  keskustelut: Keskustelu[];
  virhe: string;
  haettu: boolean;
}

const Keskustelut: React.FC = (): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const [virheteksti, setVirheteksti] = useState("");

  const [keskustelutFromApi, setKeskustelutFromApi] =
    useState<KeskustelutFromApi>({
      keskustelut: [],
      virhe: "",
      haettu: false,
    });

  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch("http://localhost:3107/api/keskustelut");
      if (yhteys.status === 200) {
        setKeskustelutFromApi({
          ...keskustelutFromApi,
          keskustelut: await yhteys.json(),
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

        setKeskustelutFromApi({
          ...keskustelutFromApi,
          virhe: virheteksti,
          haettu: true,
        });
      }
    } catch (e: any) {
      setKeskustelutFromApi({
        ...keskustelutFromApi,
        virhe: "Palvelimeen ei saada yhteyttä.",
        haettu: true,
      });
    }
  };

  useEffect(() => {
    apiKutsu();
  }, []);

  if (!keskustelutFromApi.haettu) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (Boolean(keskustelutFromApi.virhe)) {
    return <Alert severity="error">{keskustelutFromApi.virhe}</Alert>;
  }

  const formatoiAika = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d.M.y HH:mm");
    } catch {
      return "";
    }
  };

  const viimeisenViestinAika = (keskustelu: Keskustelu): string => {
    if (!keskustelu.viestit || !keskustelu.viestit.length) return "";

    return keskustelu.viestit[keskustelu.viestit.length - 1].aika;
  };

  return (
    <Container sx={{ width: "50%", paddingTop: "30px" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", marginLeft: "15px" }}
      >
        Keskustelupalsta
      </Typography>
      <List>
        {keskustelutFromApi.keskustelut
          ?.sort((a, b) => {
            if (new Date(a.aika) > new Date(b.aika)) {
              return -1;
            } else if (new Date(a.aika) === new Date(b.aika)) {
              return 0;
            } else {
              return 1;
            }
          })
          .map((keskustelu: Keskustelu) => (
            <ListItem
              key={keskustelu.id}
              alignItems="flex-start"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Link
                href={`/keskustelut/${keskustelu.id}`}
                color="inherit"
                variant="h6"
              >
                {keskustelu.otsikko}
              </Link>
              <Typography
                sx={{
                  marginBottom: "10px",
                  // color: "#777777",
                }}
              >
                {keskustelu.kirjoittaja} -{" "}
                {formatoiAika(keskustelu.aika ? keskustelu.aika : "")}
              </Typography>
              {keskustelu.viestit?.length ? (
                <Typography
                  sx={{
                    marginBottom: "20px",
                    fontStyle: "italic",
                    color: "#777777",
                  }}
                >
                  {keskustelu.viestit?.length} kommenttia, joista viimeisin{" "}
                  {formatoiAika(viimeisenViestinAika(keskustelu))}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    marginBottom: "20px",
                    fontStyle: "italic",
                    color: "#777777",
                  }}
                >
                  Ei vielä kommentteja{" "}
                </Typography>
              )}
            </ListItem>
          ))}
      </List>

      <Button
        variant="contained"
        sx={{ marginTop: "20px", marginLeft: "20px" }}
        onClick={() => navigate("/uusikeskustelu")}
      >
        Aloita uusi keskustelu
      </Button>
      <Typography>{virheteksti}</Typography>
    </Container>
  );
};

export default Keskustelut;
