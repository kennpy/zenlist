import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const app = express();

// GENERIC MIDDLEWARE
router.use(bodyParser.json());

// file stuff (since js modules do not support __dirname __filename) / 1
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// HOMEPAGE LISTENER

router.get("/", (req, res, next) => {
  console.log("Sending home page . . .");
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// file stuff (since js modules do not support __dirname __filename) / 2

router.use(express.static(path.join(__dirname, "../../public")));
console.log(path.join(__dirname, "../../public"));

export default router;
