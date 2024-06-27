import * as signalR from '@microsoft/signalr';

const HUB_URL = process.env.REACT_APP_HUB_URL;

if (!HUB_URL) {
  throw new Error("REACT_APP_HUB_URL environment variable is not set.");
}

export const createHubConnection = (token: string) => {
  try {
    return new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  } catch (error) {
    console.error("Error creating SignalR hub connection:", error);
    throw error;
  }
};
