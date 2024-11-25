import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Payload structure for workflow updates sent via WebSocket.
 */
interface WorkflowUpdatePayload {
  workflowId: number;
  nodeId: number;
  status: 'in_progress' | 'completed' | 'failed';
  timestamp?: string; // Optional timestamp for tracking
  [key: string]: any; // Additional optional fields
}

/**
 * EventsGateway manages WebSocket connections and real-time event broadcasting.
 */
@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS for WebSocket connections
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Handles a new client connection.
   * @param client - The WebSocket client instance.
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);

      // Validate the JWT token
      const payload = await this.jwtService.verifyAsync(token);
      this.logger.log(`Client connected: ${client.id}, User: ${payload.username}`);

      // Attach user data to the client
      client.data.user = payload;
    } catch (error) {
      this.logger.error(`Connection refused: ${error.message}`);
      client.disconnect(true); // Disconnect the client
    }
  }

  /**
   * Handles a client disconnection.
   * @param client - The WebSocket client instance.
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Broadcasts a workflow update to all connected clients.
   * @param data - The workflow update payload to send.
   */
  sendWorkflowUpdate(data: WorkflowUpdatePayload): void {
    try {
      this.server.emit('workflow-update', data); // Broadcast 'workflow-update' event
      this.logger.log(`Broadcasting workflow-update: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`Failed to broadcast workflow-update: ${error.message}`);
    }
  }

  /**
   * Extracts and validates the Authorization token from the client's handshake headers.
   * @param client - The WebSocket client instance.
   * @returns The extracted token.
   * @throws UnauthorizedException if the token is missing or invalid.
   */
  private extractToken(client: Socket): string {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    return authHeader.split(' ')[1]; // Extract the token part
  }
}
