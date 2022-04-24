import express from "express";
import cors from "cors";
import morgan from "morgan";
import dialogflow from "@google-cloud/dialogflow";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/", (req, res, next) => {
  res.send("Hello World Chatapp Server");
});
app.post("/talktochatbot", async (req, res, next) => {
  console.log(req.body);
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    "virtualassitanthamza-frtt", //virtualassitanthamza-frtt/
    "sessionid192993"
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.query,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  let messages = [];
  console.log("Response from Dialogflow: ", JSON.stringify(responses));
  responses[0]?.queryResult?.fulfillmentMessages?.map((eachMessage, index) => {
    if (eachMessage.platform === "PLATFORM_UNSPECIFIED") {
      messages.push({
        sender: "Chatbot",
        text: eachMessage.text.text[0],
      });
    }
  });
  res.send(messages);
});

app.post("/twiliowebhook",(req,res,next)=>{
     console.log(req.body);

     //todo: Api call dailogflow 
     res.status(200).send("Twilio Webhook");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
