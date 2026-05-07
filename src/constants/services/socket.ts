// Singleton socket connection — one connection for the whole app.
// We connect once after login and disconnect on logout.

import { BASE_URL } from "@/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = BASE_URL.replace('/api/v1', '');

class SocketService {
    private socket:Socket | null = null;

    async connect(){
        if (this.socket?.connected) return;

        const token = await AsyncStorage.getItem('accessToken');
        if(!token) return;

        this.socket = io(SOCKET_URL,{
            auth:{token},
            transports:['websocket'],
            reconnection:true,
            reconnectionAttempts:5,
            reconnectionDelay:2000
        });

        this.socket.on('connect',()=>{
            console.log('✅ Socket connected:', this.socket?.id);
        });

        this.socket.on('connect_error',(err)=>{
            console.log('❌ Socket error:', err.message);
        });

        this.socket.on('disconnect',(reason)=>{
            console.log('Socket disconnect', reason);
        });
    }

    disconnect(){
        this.socket?.disconnect();
        this.socket = null
    }

    // Join a queue room to get live updates for that queue
    joinQueueRoom(queueId:string){
        this.socket?.emit('queue:join_room',queueId);
    }

    leaveQueueRoom(queueId:string){
        this.socket?.emit('queue:leave_room',queueId);
    }

    // Listen for queue updates (position changes, next called)
    onQueueUpdated(callback:(data:QueueUpdateEvent)=>void){
        this.socket?.on('queue:updated', callback)
    }

    // Listen for personal "your turn" notification
    onTicketCalled(callback:(data:TicketCalledEvent)=>void){
        this.socket?.on('ticket:called',callback);
    }

    offQueueUpdated(){
        this.socket?.off('queue:updated');
    }
    
    offTicketCalled(){
        this.socket?.off('ticket:called');
    }

    isConnected(){
        return this.socket?.connected ?? false
    }

}

// Export a single instance — used everywhere in the app
export const socketService = new SocketService();


// ── Event types ───────────────────────────────────────────────────
export type QueueUpdateEvent = {
  queueId: string;
  event: 'ticket_joined' | 'next_called' | 'ticket_cancelled';
  nowServing?: string;
};

export type TicketCalledEvent = {
  ticketId: string;
  token: string;
  message: string;
};