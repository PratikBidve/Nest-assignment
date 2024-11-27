import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for testing; restrict in production
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Handles 'events' messages sent by the client
   */
  @SubscribeMessage('events')
  handleEvents(@MessageBody() data: any): WsResponse<string> {
    console.log('Received "events" message:', data);
    return { event: 'events', data: `Received: ${JSON.stringify(data)}` };
  }

  /**
   * Handles 'workflow-status' requests sent by the client
   */
  @SubscribeMessage('workflow-status')
  handleWorkflowStatus(@MessageBody() workflowId: number): string {
    console.log(`Received request for workflow status: Workflow ID ${workflowId}`);
    return `Status for workflow ${workflowId}`;
  }

  /**
   * Sends a workflow update to all connected WebSocket clients
   */
  sendWorkflowUpdate(payload: {
    workflowId: number;
    nodeId: number | null;
    status: string;
    timestamp: string;
  }): void {
    console.log('Broadcasting workflow update:', payload);
    this.server.emit('workflow-update', payload);
  }
}
