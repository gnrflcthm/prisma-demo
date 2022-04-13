import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/todos", async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.status(200).json(todos);
})

app.post("/todo", async (req: Request, res: Response) => {
    const { title } = req.body;
    const newTodo = await prisma.todo.create({
        data: {
            title: title
        }
    })
    return res.status(200).json(newTodo);
});

app.put("/todo/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;
    const updatedTodo = await prisma.todo.update({
        data: {
            title: title
        },
        where: {
            id: parseInt(id)
        }
    });
    return res.status(200).json(updatedTodo);
});

app.put("/completetodo/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateTodo = await prisma.todo.update({
        data: {
            status: "completed"
        },
        where: {
            id: parseInt(id)
        }
    });
    return res.status(200).json(updateTodo);
});

app.delete("/todo/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedTodo = await prisma.todo.delete({
        where: {
            id: parseInt(id)
        }
    });
    return res.status(200).json(deletedTodo);
})

app.listen(PORT, () => { 
    console.log(`Listening at port ${PORT}`);
})