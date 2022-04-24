import express from "express";
import cors from "cors";
import morgan from "morgan";
import dialogflow from "@google-cloud/dialogflow";
import bodyParser from 'body-parser';
import twilio from 'twilio'

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res, next) => {
  res.send("Hello World Chatapp Server");
});
app.post("/talktochatbot", async (req, res, next) => {
  console.log(req.body);
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    "virtualassitanthamza-frtt", //virtualassitanthamza-frtt/
    "sessionid1303030"
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

app.post("/twiliowebhook",async(req,res,next)=>{
     console.log(req.body);
     let response = new twilio.twiml.MessagingResponse();
    //  response.message("Hello World from custom tire twilio sever"); 
     //todo: Api call dailogflow 
       // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    "virtualassitanthamza-frtt", //virtualassitanthamza-frtt/
    "sessionidfj49399393"
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.Body,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  console.log("Response from Dialogflow: ", JSON.stringify(responses));
  responses[0]?.queryResult?.fulfillmentMessages?.map((eachMessage, index) => {
    if (eachMessage.platform === "PLATFORM_UNSPECIFIED") {
      response.message(eachMessage.text.text[0]);
    }
  });

     res.status(200).send(response.toString());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
