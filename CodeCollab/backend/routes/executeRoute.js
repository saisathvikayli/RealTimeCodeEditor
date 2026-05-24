import express from "express";
import axios from "axios";

const router = express.Router();

// Judge0 API config
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

//execute code
router.post("/run", async (req, res) => {
  try {
    const { source_code, language_id, stdin } = req.body;

  
    const submission = await axios.post(
      `${JUDGE0_URL}?base64_encoded=false&wait=false`,
      {
        source_code,
        language_id,
        stdin,
      },
      { headers }
    );

    const token = submission.data.token;

    
    let result;
    while (true) {
      const response = await axios.get(`${JUDGE0_URL}/${token}`, {
        headers,
      });

      result = response.data;

      if (result.status.id > 2) break; // finished
      await new Promise((r) => setTimeout(r, 1000));
    }

    res.json({
      output: result.stdout,
      error: result.stderr,
      compile_output: result.compile_output,
      status: result.status.description,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Execution failed" });
  }
});

export default router;