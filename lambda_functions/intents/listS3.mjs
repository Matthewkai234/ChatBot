import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "eu-west-1" });

export const handler = async (event) => {
    console.log("Received event to list S3 buckets:", JSON.stringify(event, null, 2));

    const command = new ListBucketsCommand({});

    try {
        const data = await client.send(command);
        console.log("ListBuckets successful:", JSON.stringify(data, null, 2));

        const bucketsInfo = [];
        if (data.Buckets && data.Buckets.length > 0) {
            data.Buckets.forEach(bucket => {
                bucketsInfo.push({
                    name: bucket.Name,
                    creationDate: bucket.CreationDate?.toISOString()
                });
            });
        }

        const responseMessage = bucketsInfo.length === 0
            ? "No S3 buckets found in this account."
            : `Here are your S3 buckets: ${bucketsInfo.map(b => b.name).join(', ')}`;

        return {
            sessionState: {
                dialogAction: {
                    type: 'Close'
                },
                intent: {
                    name: event.sessionState.intent.name,
                    state: 'Fulfilled'
                }
            },
            messages: [
                {
                    contentType: 'PlainText',
                    content: responseMessage
                }
            ]
        };

    } catch (error) {
        console.error("Error listing S3 buckets:", error);
        return {
            sessionState: {
                dialogAction: {
                    type: 'Close'
                },
                intent: {
                    name: event.sessionState.intent.name,
                    state: 'Failed'
                }
            },
            messages: [
                {
                    contentType: 'PlainText',
                    content: "Sorry, I couldn't list your S3 buckets. Please try again later."
                }
            ]
        };
    }
};