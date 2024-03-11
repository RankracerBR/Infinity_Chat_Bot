import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const MODEL_NAME = 'llama-2-7b-chat.Q8_0.gguf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDirectory = path.join(__dirname, '../models');
const modelsPath = path.join(modelsDirectory, MODEL_NAME);

const model = new LlamaModel({
  modelPath: modelsPath,
});

const context = new LlamaContext({ model });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  const session = new LlamaChatSession({ context });

  const response = await session.prompt(userMessage);

  res.json({
      text: response,
      isBot: true,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});