import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://62.90.222.249:10001/ClientHub';

export const setupSignalRConnection = (token: string, onDataReceived: (data: any) => void) => {

    
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on('DataReceived', onDataReceived);

  connection.start()
    .then(() => console.log('SignalR connection established.'))
    .catch((err) => {
      console.error('SignalR connection failed:', err);
      if (err.statusCode) {
        console.error('Status Code:', err.statusCode);
      }
    });

  connection.onclose((err) => {
    console.log('SignalR connection closed:', err);
  });

  return connection;
};


