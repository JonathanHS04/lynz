import express from 'express';

import cors from 'cors';

import usersRouter from "./routers/users/users.routes";
import { errorMiddleware } from './middlewares/error.middleware';

import artistsRouter from "./routers/artistsAlbumsSongs/artists.routes";
import songsRouter from "./routers/artistsAlbumsSongs/songs.routes";
import albumsRouter from "./routers/artistsAlbumsSongs/albums.routes";

import searchRouter from "./routers/search.routes";


const app: express.Express = express();

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
