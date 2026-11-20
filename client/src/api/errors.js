const SERVER_ERROR_MESSAGE = "Something went wrong. Please try again.";
const CONNECTION_ERROR_MESSAGE = "Cannot reach server. Please check your connection and try again.";

export function getErrorMessage(error) {
    // Check if the request failed before getting a response.
    if (error?.status === undefined) {
        return CONNECTION_ERROR_MESSAGE;
    }

    // 500-599
    if (error.status >= 500) {
        return SERVER_ERROR_MESSAGE;
    }

    // 400-499
    return error.message?.trim() || SERVER_ERROR_MESSAGE;
}