import { EC2Client, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

// Helper to extract target region from various event sources
const getTargetRegionFromEvent = (event, defaultRegion) => {
    let targetRegion = defaultRegion;
    if (event.sessionState && event.sessionState.intent && event.sessionState.intent.slots &&
        event.sessionState.intent.slots.Region && event.sessionState.intent.slots.Region.value &&
        event.sessionState.intent.slots.Region.value.interpretedValue) {
        targetRegion = event.sessionState.intent.slots.Region.value.interpretedValue;
    } else if (event.body) { 
        try {
            const body = JSON.parse(event.body);
            if (body.region) targetRegion = body.region;
        } catch (e) {console.error(e) }
    } else if (event.region) {
        targetRegion = event.region;
    }
    return targetRegion;
};


const buildLexV2Response = (sessionState, messages) => {
    return {
        sessionState,
        messages
    };
};

export const handler = async (event, context) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const defaultRegion = process.env.AWS_REGION; // Lambda's deployment region
    let instanceIdsToTerminate = [];
    let targetRegion = defaultRegion;
    let lexIntentName = "";
    let lexSlots = {};

    // --- Extract data based on invoker (Lex or direct/API Gateway) ---
    if (event.sessionState && event.sessionState.intent) {
        lexIntentName = event.sessionState.intent.name;
        lexSlots = event.sessionState.intent.slots || {};
        targetRegion = getTargetRegionFromEvent(event, defaultRegion);

        if (lexSlots.InstanceIDs) {
            const slotData = lexSlots.InstanceIDs;

            if (Array.isArray(slotData.values) && slotData.values.length > 0) {
                instanceIdsToTerminate = slotData.values.map(slotValueDetail => slotValueDetail.value.interpretedValue);
            } else if (slotData.value && slotData.value.interpretedValue) {
                instanceIdsToTerminate = [slotData.value.interpretedValue];
            } else if (slotData.interpretedValue) {
                instanceIdsToTerminate = [slotData.interpretedValue];
            }
        }

    } else if (event.body) { // API Gateway with JSON body
        try {
            const body = JSON.parse(event.body);
            instanceIdsToTerminate = body.instanceIds || [];
            targetRegion = getTargetRegionFromEvent(event, defaultRegion);
        } catch (e) {
            console.error("Error parsing event.body for API Gateway:", e);
            return { statusCode: 400, body: JSON.stringify({ message: "Invalid JSON in request body." }) };
        }
    } else { // Direct Lambda invocation
        instanceIdsToTerminate = event.instanceIds || [];
        targetRegion = getTargetRegionFromEvent(event, defaultRegion);
    }


    // --- Input Validation ---
    if (instanceIdsToTerminate.length === 0) {
        const message = "Which instance ID or IDs do you want to terminate? Please provide at least one.";
        if (event.sessionState) { // Lex response
            return buildLexV2Response({
                dialogAction: { type: "ElicitSlot", slotToElicit: "InstanceIDs" },
                intent: { name: lexIntentName, slots: lexSlots }
            }, [{ contentType: "PlainText", content: message }]);
        }
        return { statusCode: 400, body: JSON.stringify({ message }) };
    }

    for (const id of instanceIdsToTerminate) {
        if (typeof id !== 'string' || !id.startsWith('i-') || !/^i-[0-9a-fA-F]{8,17}$/.test(id)) {
            const message = `The ID '${id}' doesn't look like a valid EC2 instance ID. Instance IDs start with 'i-' followed by 8 or 17 hex characters. Please try again.`;
            if (event.sessionState) { // Lex response
                return buildLexV2Response({
                    dialogAction: { type: "ElicitSlot", slotToElicit: "InstanceIDs" },
                    intent: { name: lexIntentName, slots: lexSlots }
                }, [{ contentType: "PlainText", content: message }]);
            }
            return { statusCode: 400, body: JSON.stringify({ message }) };
        }
    }

    console.log(`Attempting to terminate instances: ${instanceIdsToTerminate.join(', ')} in region: ${targetRegion}`);
    const client = new EC2Client({ region: targetRegion });

    const terminateParams = {
        InstanceIds: instanceIdsToTerminate,
        // DryRun: true // IMPORTANT: Uncomment for initial testing!
    };

    try {
        if (event.sessionState && event.sessionState.intent.confirmationState !== "Confirmed" && event.sessionState.intent.confirmationState !== "Denied") {
            console.log("Lex confirmation state:", event.sessionState.intent.confirmationState);
        }

        const command = new TerminateInstancesCommand(terminateParams);
        const data = await client.send(command);
        console.log("TerminateInstances API call successful:", JSON.stringify(data, null, 2));

        const terminatedInstancesInfo = data.TerminatingInstances?.map(inst => ({
            instanceId: inst.InstanceId,
            currentState: inst.CurrentState?.Name,
            previousState: inst.PreviousState?.Name
        })) || [];

        const successMessage = `Termination request submitted for instance(s): ${instanceIdsToTerminate.join(', ')}. Result: ${terminatedInstancesInfo.map(i => `${i.instanceId} (${i.currentState})`).join('; ')}`;

        if (event.sessionState) { // Lex response
            return buildLexV2Response({
                dialogAction: { type: "Close" },
                intent: { name: lexIntentName, slots: lexSlots, state: "Fulfilled" }
            }, [{ contentType: "PlainText", content: successMessage }]);
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: successMessage, terminationDetails: terminatedInstancesInfo })
        };

    } catch (error) {
        console.error("Error terminating EC2 instances:", error);
        let errorMessage = `Failed to terminate instance(s): ${instanceIdsToTerminate.join(', ')}. Error: ${error.message}`;

        if (error.name === 'DryRunOperation') {
            errorMessage = "Dry run successful. Termination would have been initiated. Parameters are valid.";
            console.log(errorMessage);
            if (event.sessionState) {
                return buildLexV2Response({
                    dialogAction: { type: "Close" },
                    intent: { name: lexIntentName, slots: lexSlots, state: "Fulfilled" }
                }, [{ contentType: "PlainText", content: errorMessage }]);
            }
            return { statusCode: 200, body: JSON.stringify({ message: errorMessage, instanceIds: instanceIdsToTerminate }) };
        }

        if (event.sessionState) {
            return buildLexV2Response({
                dialogAction: { type: "Close" },
                intent: { name: lexIntentName, slots: lexSlots, state: "Failed" }
            }, [{ contentType: "PlainText", content: errorMessage }]);
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: errorMessage, errorName: error.name })
        };
    }
};
