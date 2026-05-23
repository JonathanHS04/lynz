import express from 'express';

import cors from 'cors';

import usersRouter from "./routers/users/users.routes.js";
import { errorMiddleware } from './middlewares/error.middleware.js';

import artistsRouter from "./routers/artistsAlbumsSongs/artists.routes.js";
import songsRouter from "./routers/artistsAlbumsSongs/songs.routes.js";
import albumsRouter from "./routers/artistsAlbumsSongs/albums.routes.js";

import searchRouter from "./routers/search.routes.js";


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json());


app.use("/api/artist", artistsRouter);
app.use("/api/song", songsRouter);
app.use("/api/album", albumsRouter);
app.use("/api/user", usersRouter);
app.use("/api/search", searchRouter);

app.use(errorMiddleware);

export default app;
