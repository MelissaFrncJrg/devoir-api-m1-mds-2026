import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";

const prisma = new PrismaClient();

export const voituresRouter = Router();

voituresRouter.get("/", checkToken, async (req, res) => {
    try {
        const voitures = await prisma.voiture.findMany();
        res.json(voitures);
    } catch (error) {
        res.status(500).send("Failed to fetch voitures.")
    }
});

voituresRouter.get("/:id", checkToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const voiture = await prisma.voiture.findFirst({ where: { id: id } });
        res.json(voiture);
    } catch (error) {
        res.status(500).send("Failed to fetch voitures.")
    }
});

voituresRouter.post("/", checkToken, async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send("Failed to create entry.")
    }
});

voituresRouter.patch("/:id", checkToken, async (req, res) => {
    try {
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
        } else {
            res.status(404).send("Voiture not found");
        }
    } catch (error) {
        res.status(500).send("Failed to update entry.")
    }
});

voituresRouter.delete("/:id", checkToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const actual = await prisma.voiture.findFirst({ where: { id } });
        if (actual) {
            await prisma.voiture.delete({ where: { id } });
            res.json(actual);
        }
        else {
            res.status(404).send("Voiture not found");
        }
    } catch (error) {
        res.status(500).send("Failed to delete entry.")
    }
});
