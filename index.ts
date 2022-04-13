import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/user/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
        where: {
            id: parseInt(id)
        },
        include: {
            posts: {
                include: {
                    comments: true
                }
            }
        }
    })
    console.log(user);
    return res.status(200).json(user);
});

app.post("/user", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })
        return res.status(200).json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Error In Creating User." })
    }
});

app.get("/posts", async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
        include: {
            comments: {
                orderBy: {
                    datePosted: "desc"
                }
            }
        }
    });
    return res.status(200).json(posts);
});

app.post("/post", async (req: Request, res: Response) => {
    const { userID, content } = req.body;
    try {
        const newPost = await prisma.post.create({
            data: {
                content: content,
                User: {
                    connect: {
                        id: parseInt(userID)
                    }
                }
            },
        });
        return res.status(200).json(newPost);
    } catch (err) {
        return res.status(400).json({ msg: "An Error Has Occured!" })
    }
});

app.get("/post/:postId/comments", async (req: Request, res: Response) => {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
        where: {
            postId: {
                equals: parseInt(postId)
            }
        },
    })
    return res.status(200).json(comments);
});

app.post("/comment", async (req: Request, res: Response) => {
    const { postId, userId, content } = req.body;
    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                Post: {
                    connect: {
                        id: postId
                    }
                },
                User: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
        return res.status(200).json(newComment);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "An Error has Occured" });
    }
});

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})