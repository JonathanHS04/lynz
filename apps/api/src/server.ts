import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res, next) => {
  console.log("REQ GLOBAL:", req.method, req.url)
  next()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

