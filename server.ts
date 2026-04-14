import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();
const port = 4000;

// Load swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Serve Swagger UI directly - no import of swagger.js
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server running', swagger: 'http://localhost:4000/api-docs' });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
});