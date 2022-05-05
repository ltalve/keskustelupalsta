import React from "react";
import { useState, useRef } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { fetchAsetukset } from "../types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Typography, Container, Button, TextField } from "@mui/material";

const UusiKeskustelu: React.FC = (): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const quillRef: any = useRef<any>();

  const [otsikko, setOtsikko] = useState("");
  const [kirjoittaja, setKirjoittaja] = useState("Anonyymi");
  const [virheteksti, setVirheteksti] = useState("");

  const lahetaUusiKeskustelu = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    console.log(quillRef.current.getEditorContents());

    if (!otsikko || !quillRef.current.getEditorContents()) {
      setVirheteksti("Anna keskustelulle otsikko ja sisältö.");
    } else {
      try {
        const fetchParams: fetchAsetukset = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otsikko: otsikko,
            sisalto: quillRef.current.getEditorContents(),
            kirjoittaja: kirjoittaja,
          }),
        };
        const yhteys = await fetch(
          "http://localhost:3107/api/keskustelut",
          fetchParams
        );
        if (yhteys.status === 200) {
          navigate("/");
        } else {
          switch (yhteys.status) {
            case 404:
              setVirheteksti(`Tietoja ei löydy (virhekoodi ${yhteys.status})`);
              break;
            default:
              setVirheteksti(
                `Palvelimella tapahtui odottamaton virhe. (virhekoodi ${yhteys.status})`
              );
              break;
          }
        }
      } catch (e: any) {
        console.log("Virhe palvelimella: " + e);
      }
    }
  };

  return (
    <Container
      component="form"
      onSubmit={lahetaUusiKeskustelu}
      sx={{
        width: "50%",
        margin: "auto",
        paddingTop: "30px",
      }}
    >
      <Typography variant="h4" sx={{ marginTop: "30px", marginBottom: "20px" }}>
        Aloita uusi keskustelu
      </Typography>
      <TextField
        name="otsikko"
        label="Otsikko"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "10px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setOtsikko(e.target.value);
        }}
      />
      <br />

      <ReactQuill
        ref={quillRef}
        style={{
          height: 200,
          marginBottom: 50,
          marginTop: 30,
        }}
      />

      <br />
      <TextField
        name="kirjoittaja"
        label="Kirjoittajan nimi tai nimimerkki"
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "50px",
        }}
        onChange={(e) => {
          e.preventDefault();
          setKirjoittaja(e.target.value);
        }}
      />
      <br />

      <Typography color="red" marginTop={"10px"}>
        {virheteksti}
      </Typography>

      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: "10px",
        }}
      >
        Lähetä
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{
          marginTop: "10px",
          marginLeft: "20px",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        Peruuta
      </Button>
    </Container>
  );
};

export default UusiKeskustelu;
