import React from "react";
import { useState } from "react";
import { useParams, NavigateFunction, useNavigate } from "react-router-dom";
import { fetchAsetukset } from "../types";
import { Link } from "@mui/material";
import { Typography, Container, Button, TextField } from "@mui/material";

export type UusiViestiProps = {
  haeViestit: () => Promise<void>;
};

const UusiViesti = (props: UusiViestiProps): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();
  const params = useParams();

  const [sisalto, setSisalto] = useState("");
  const [kirjoittaja, setKirjoittaja] = useState("Anonyymi");

  const lahetaUusiViesti = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const fetchParams: fetchAsetukset = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keskusteluId: params.id,
          sisalto: sisalto,
          kirjoittaja: kirjoittaja,
        }),
      };
      const yhteys = await fetch(
        `http://localhost:3107/api/keskustelut/${params.id}/viestit`,
        fetchParams
      );
      if (yhteys.status === 200) {
        props.haeViestit();
        setSisalto("");
        setKirjoittaja("");
      }
    } catch (e: any) {
      console.log("Virhe palvelimella: " + e);
    }
  };

  return (
    <Container
      component="form"
      onSubmit={lahetaUusiViesti}
      sx={{
        margin: "auto",
        paddingTop: "30px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Kommentoi
      </Typography>
      <TextField
        name="sisalto"
        label="Kommentti"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "10px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setSisalto(e.target.value);
        }}
      />
      <br />
      <TextField
        name="kirjoittaja"
        label="Kirjoittajan nimi tai nimimerkki"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "10px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setKirjoittaja(e.target.value);
        }}
      />
      <br />

      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: "30px",
        }}
        onClick={() => {
          navigate(`/keskustelut/${params.id}`);
        }}
      >
        Vastaa keskusteluun
      </Button>

      <Typography sx={{ marginTop: "20px" }}>
        <Link href="/">Palaa etusivulle</Link>
      </Typography>
    </Container>
  );
};

export default UusiViesti;
