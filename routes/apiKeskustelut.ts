import express from "express";
import { PrismaClient } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

const prisma: PrismaClient = new PrismaClient();

const apiKeskustelutRouter: express.Router = express.Router();

type UusiKeskusteluInput = {
  otsikko: string;
  sisalto: string;
  kirjoittaja: string;
};

type UusiViestiInput = {
  keskusteluId: number | never;
  sisalto: string;
  kirjoittaja: string;
};

// Haetaan kaikki keskustelut
apiKeskustelutRouter.get(
  "/",
  async (_req: express.Request, res: express.Response) => {
    try {
      res.json(
        await prisma.keskustelu.findMany({
          include: {
            viestit: true,
          },
        })
      );
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

// Haetaan yksittäinen keskustelu id:llä
apiKeskustelutRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      res.json(
        await prisma.keskustelu.findUnique({
          where: { id: Number(req.params.id) },
        })
      );
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

// Lisätään uusi keskustelu
apiKeskustelutRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    try {
      const uusikeskustelu: UusiKeskusteluInput =
        await prisma.keskustelu.create({
          data: {
            otsikko: req.body.otsikko,
            sisalto: sanitizeHtml(req.body.sisalto),
            kirjoittaja: req.body.kirjoittaja,
          },
        });
      res.json(uusikeskustelu);
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

// Haetaan yksittäiseen keskusteluun kuuluvat viestit
apiKeskustelutRouter.get(
  "/:id/viestit",
  async (req: express.Request, res: express.Response) => {
    try {
      res.json(
        await prisma.viesti.findMany({
          where: { keskusteluId: Number(req.params.id) },
        })
      );
    } catch (e: any) {
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

// Lisätään viesti keskusteluun
apiKeskustelutRouter.post(
  "/:id/viestit",
  async (req: express.Request, res: express.Response) => {
    try {
      const uusi: UusiViestiInput = {
        keskusteluId: Number(req.params.id),
        sisalto: req.body.sisalto,
        kirjoittaja: req.body.kirjoittaja,
      };

      const uusiviesti: UusiViestiInput = await prisma.viesti.create({
        data: uusi,
      });
      res.json(uusiviesti);
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ virhe: "Tapahtui virhe." });
    }
  }
);

export default apiKeskustelutRouter;
