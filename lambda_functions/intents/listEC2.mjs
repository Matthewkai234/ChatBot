import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";


const validRegions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-south-1",
  "sa-east-1",
  "ca-central-1",

];

export const handler = async (event, context) => {
  console.log("Lambda event received:", JSON.stringify(event, null, 2));

  const intentName = event.sessionState?.intent?.name || "UnknownIntent";
  const userInput = event.inputTranscript?.toLowerCase() || "";
  const cancelCommands = ["cancel", "stop", "back", "nevermind", "exit"];

  if (cancelCommands.includes(userInput)) {
    return {
      sessionState: {
        dialogAction: { type: "Close" },
        intent: {
          name: intentName, // نحتفظ بنفس الإنتنت الحالي
          state: "Fulfilled",
          slots: event.sessionState?.intent?.slots || {},
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "Okay, I've cancelled your request.",
        },
      ],
    };
  }
  const currentSlots = event.sessionState?.intent?.slots || {};

  const targetRegionSlot = currentSlots.TargetRegion;
  const targetRegionValue = targetRegionSlot && targetRegionSlot.value && targetRegionSlot.value.interpretedValue;

  if (!targetRegionValue) {
    return {
      sessionState: {
        dialogAction: {
          type: "ElicitSlot",
          slotToElicit: "TargetRegion",
        },
        intent: {
          name: intentName,
          slots: currentSlots,
          state: "InProgress",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "Select AWS Region to Check",
        },
      ],
    };
  }

  const targetRegion = targetRegionValue.toLowerCase();

  if (!validRegions.includes(targetRegion)) {
    return {
      sessionState: {
        dialogAction: {
          type: "ElicitSlot",
          slotToElicit: "TargetRegion",
        },
        intent: {
          name: intentName,
          slots: currentSlots,
          state: "InProgress",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: `The region "${targetRegion}" is not valid. Please enter a valid AWS region code like us-east-1 or eu-west-1.`,
        },
      ],
    };
  }

  console.log(`Using target region from slot: ${targetRegion}`);

  const client = new EC2Client({ region: targetRegion });
  const describeInstancesCommand = new DescribeInstancesCommand({});

  let messageForLex = "";
  let fulfillmentStatus = "Fulfilled";
  const structuredInstancesData = [];

  try {
    const data = await client.send(describeInstancesCommand);
    let instanceCount = 0;

    if (data.Reservations && data.Reservations.length > 0) {
      data.Reservations.forEach(reservation => {
        reservation.Instances.forEach(instance => {
          instanceCount++;
          const nameTag = instance.Tags?.find(tag => tag.Key === 'Name');
          const instanceName = nameTag ? nameTag.Value : 'N/A';

          structuredInstancesData.push({
            id: instance.InstanceId,
            name: instanceName,
            type: instance.InstanceType,
            state: instance.State?.Name,
            launchTime: instance.LaunchTime?.toISOString(),
            publicIp: instance.PublicIpAddress || 'N/A',
            privateIp: instance.PrivateIpAddress || 'N/A'
          });
        });
      });
    }

    if (instanceCount === 0) {
        messageForLex = `No EC2 instances found in region ${targetRegion}.`;
    } else {
        messageForLex = `Found ${instanceCount} EC2 instance(s) in region ${targetRegion}:\n\n`;
        structuredInstancesData.forEach((inst, index) => {
            messageForLex += `Instance ${index + 1}:\n`;
            messageForLex += `  - ID: ${inst.id}\n`;
            messageForLex += `  - Name: ${inst.name}\n`;
            messageForLex += `  - Type: ${inst.type}\n`;
            messageForLex += `  - State: ${inst.state}\n`;
            if (inst.publicIp !== 'N/A') {
                messageForLex += `  - Public IP: ${inst.publicIp}\n`;
            }
            if (index < structuredInstancesData.length - 1) {
                messageForLex += `\n`; 
            }
        });
    }
    
  } catch (error) {
    console.error(`Error describing EC2 instances in region ${targetRegion}:`, error);
    messageForLex = `Sorry, I encountered an error trying to list EC2 instances for region ${targetRegion}. Details: ${error.name} - ${error.message}`;
    fulfillmentStatus = "Failed";
  }

  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intentName,
        slots: currentSlots,
        state: fulfillmentStatus,
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: messageForLex.substring(0, 1020),
      },
    ],
  };
};
