import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://62.90.222.249:10001/ClientHub';

export const createHubConnection = (token: string) => {
  return new signalR.HubConnectionBuilder()
    .withUrl('http://62.90.222.249:10001/ClientHub', {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};


