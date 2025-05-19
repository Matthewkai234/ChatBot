import { S3Client, DeleteBucketCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "eu-west-1" });

export const handler = async (event) => {
    console.log("Received event to delete S3 bucket:", JSON.stringify(event, null, 2));

    const bucketName = event.sessionState.intent.slots.BucketName?.value?.interpretedValue;
    const confirmationStatus = event.sessionState.intent.confirmationStatus;

    // If bucket name is missing, elicit it
    if (!bucketName) {
        return {
            sessionState: {
                dialogAction: {
                    type: 'ElicitSlot',
                    slotToElicit: 'BucketName'
                },
                intent: {
                    name: event.sessionState.intent.name,
                    slots: event.sessionState.intent.slots,
                    state: 'InProgress'
                }
            },
            messages: [{
                contentType: 'PlainText',
                content: 'Which S3 bucket would you like to delete? Please provide the exact bucket name.'
            }]
        };
    }

    // If we have bucket name but no confirmation decision yet
    if (confirmationStatus === 'None') {
        return {
            sessionState: {
                dialogAction: {
                    type: 'ConfirmIntent'
                },
                intent: {
                    name: event.sessionState.intent.name,
                    slots: event.sessionState.intent.slots,
                    state: 'InProgress'
                }
            },
            messages: [{
                contentType: 'PlainText',
                content: `Are you sure you want to permanently delete the bucket "${bucketName}"? This cannot be undone. Please confirm with "yes" or "no".`
            }]
        };
    }

    // If user denied confirmation
    if (confirmationStatus === 'Denied') {
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
            messages: [{
                contentType: 'PlainText',
                content: `Bucket deletion cancelled. The bucket "${bucketName}" was not deleted.`
            }]
        };
    }

    // Only proceed if confirmationStatus is 'Confirmed'
    try {
        await emptyBucket(bucketName);
        await client.send(new DeleteBucketCommand({ Bucket: bucketName }));
        
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
            messages: [{
                contentType: 'PlainText',
                content: `Successfully deleted the S3 bucket: ${bucketName}`
            }]
        };
    } catch (error) {
        console.error("Error deleting S3 bucket:", error);
        let errorMessage = `Failed to delete bucket ${bucketName}.`;
        
        if (error.name === 'NoSuchBucket') {
            errorMessage = `The bucket "${bucketName}" doesn't exist.`;
        } else if (error.name === 'AccessDenied') {
            errorMessage = `I don't have permission to delete "${bucketName}".`;
        }
        
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
            messages: [{
                contentType: 'PlainText',
                content: errorMessage
            }]
        };
    }
};

async function emptyBucket(bucketName) {
    const listObjectsResponse = await client.send(
        new ListObjectsV2Command({ Bucket: bucketName })
    );
    
    if (listObjectsResponse.Contents?.length > 0) {
        await client.send(
            new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: listObjectsResponse.Contents.map(obj => ({ Key: obj.Key }))
                }
            })
        );
    }
}