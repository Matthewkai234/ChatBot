
export const handler = async (event, context) => {
    console.log("FallbackIntent triggered with event:", JSON.stringify(event, null, 2));

    const misunderstoodUtterance = event.inputTranscript || "your previous request";
    // Log the misunderstood utterance for analysis (e.g., to CloudWatch or a dedicated logging service)
    console.log(`User utterance not understood: "${misunderstoodUtterance}"`);

    // You can have a list of varied responses
    const fallbackResponses = [
        `I'm sorry, I didn't understand "${misunderstoodUtterance}". Can you please rephrase, or ask for 'help' to see what I can do?`,
        `Hmm, I'm not sure how to handle that. For a list of my capabilities, just say 'help'.`,
        `My apologies, I couldn't process that. Try asking in a different way, or type 'help' for options.`,
        `I'm still learning! If you're stuck, ask for 'help' and I'll tell you what I can assist with.`
    ];

    const selectedResponseMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    // Determine the current intent name (should be FallbackIntent here)
    const intentName = event.sessionState && event.sessionState.intent ? event.sessionState.intent.name : "FallbackIntent";

    return {
        sessionState: {
            dialogAction: {
                type: "ElicitIntent", // Keeps the session open and prompts the user for new input
                                      // Could also be "Close" if you prefer to end after a fallback.
            },
            intent: { // Lex requires the intent to be passed back
                name: intentName,
                state: "Fulfilled", 
            }
            // You could also set sessionAttributes here if needed for context
        },
        messages: [
            {
                contentType: "PlainText",
                content: selectedResponseMessage
            }
        ]
    };
};