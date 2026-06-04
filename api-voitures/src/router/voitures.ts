import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";

const prisma = new PrismaClient();

export const voituresRouter = Router();

voituresRouter.get("/", checkToken, async (req, res) => {
    const voitures = await prisma.voiture.findMany();
    res.json(voitures);
});

voituresRouter.get("/:id", checkToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const voiture = await prisma.voiture.findFirst({ where: { id: id } });
    res.json(voiture);
});

voituresRouter.post("/", checkToken, async (req, res) => {
    const { name, price } = req.body;
    if(!name || !price){
        res.status(400).send("Missing required information");
    }
    else {
        const newVoiture = await prisma.voiture.create({
            data: {
                name,
                price
            }
        });
        res.json(newVoiture);
    }
});

voituresRouter.patch("/:id", checkToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const actual = await prisma.voiture.findFirst({ where: { id: id } });
    if (actual) {
        const updatedVoiture = await prisma.voiture.update({
            where: { id: id },
            data: {
                name: name || actual.name,
                price: price || actual.price
            }
        });
        res.json(updatedVoiture);
    }
});

voituresRouter.delete("/:id", checkToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const actual = await prisma.voiture.findFirst({ where: { id } });
    if (actual) {
        await prisma.voiture.delete({ where: { id } });
        res.json(actual);
    }
    else {
        res.status(404).send("Voiture not found");
    }
});