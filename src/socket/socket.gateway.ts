import { Inject, Logger, UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';

import { RedisIoAdapter } from './redis.adapter';
import { PCRoomService } from 'src/pcroom/pcroom.service';
import { RemotePCService } from 'src/remotepc/remotepc.service';
import { PointService } from 'src/point/point.service';
import { UsageService } from 'src/usage/usage.service';

@UseInterceptors(RedisIoAdapter)
@WebSocketGateway()
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private static readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(PCRoomService)
    private readonly pcRoomService: PCRoomService,
    @Inject(RemotePCService)
    private readonly remotePCService: RemotePCService,
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UsageService)
    private readonly usageService: UsageService,
  ) {}

  afterInit(server: Server) {
    SocketGateway.logger.log('Init');
  }

  async handleConnection(client: any, ...args: any[]) {
    try {
      const query: any = client.handshake.query;

      if (query?.clientType === 'remotepc') {
        console.log(`connect RemotePC :  ${client.id} ${query.clientType}`);

        //
        const { ip, mac } = query;
        const remotePC = await this.remotePCService.findOneByIpMac(ip, mac);
        if (!remotePC) {
          console.log('remotePC not registered. disconnecting...');
          client.disconnect();
          return;
        }

        //
        const multi = client?.adapter?.pubClient?.multi();
        multi.set(`remotepc:${remotePC.pcIdx}`, client.id);
        multi.set(
          `remotepc:${client.id}`,
          JSON.stringify({
            pcIdx: remotePC.pcIdx,
            ridx: remotePC.rIdx,
            midx: remotePC.mIdx,
          }),
        );
        multi.exec((err, replies) => {
          if (err) {
            console.log('err: ', err);
            client.disconnect();
          } else {
            console.log('replies: ', replies);
          }
        });

        return;
      }

      const authorization: string = query.token;
      console.log(
        `connect CloudPC: ${client.id} token: ${authorization.substring(
          0,
          6,
        )}...${authorization.substring(authorization.length - 6)}`,
      );

      if (!authorization) {
        client.disconnect();
        return;
      }

      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer' || !token || token === 'null' || token === '') {
        client.disconnect();
        return;
      }

      // TODO: JWT 검증시 에러나는 문제 체크할것.
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      //
      // client.decodedToken = decoded;

      SocketGateway.logger.log(
        `Client Connected : ${client.id} ${decoded?.mIdx || 'Unknown User'}`,
      );
    } catch (error) {
      SocketGateway.logger.log(`Connect error : ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    //
    SocketGateway.logger.log(`disconnected : ${client.id}`);
  }

  // peer signal event
  @SubscribeMessage('signal')
  async onSignal(
    client: any,
    payload: {
      signal: string;
      pcIdx: string;
      cloudpc: string;
      videoCodec: string;
      videoBitrate: number;
      videoProfile: string;
    },
  ) {
    SocketGateway.logger.log(`signal: ${client.id}`);

    //
    if (payload.pcIdx) {
      const remoteId = await client?.adapter?.pubClient.get(
        `remotepc:${payload.pcIdx}`,
      );

      if (remoteId) {
        this.server.to(remoteId).emit('signal', {
          signal: payload.signal,
          cloudpc: client.id,
          videoCodec: payload.videoCodec,
          videoBitrate: payload.videoBitrate,
          videoProfile: payload.videoProfile,
        });
      } else {
        SocketGateway.logger.error('signal error: remoteId not found');
      }
    } else if (payload.cloudpc) {
      this.server
        .to(payload.cloudpc)
        .emit('signal', { signal: payload.signal });
    } else {
      SocketGateway.logger.error('signal error: unknown pcIdx or cloudpc');
    }
  }

  //
  @SubscribeMessage('getPCRoomList')
  async getPCRoomList(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const pcRoomList = await this.pcRoomService.findAll();
      // this.server.to(client.id).emit('getPCRoomList', pcRoomList);
      return pcRoomList;
    } catch (error) {
      SocketGateway.logger.error(error);
      // this.server
      //   .to(client.id)
      //   .emit('error', { event: 'getPCRoomList', error: error.message });
      return [];
    }
  }

  @SubscribeMessage('getRemotePCList')
  async getRemotePCList(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      let remotePCList: any = [];
      if (data?.rIdx >= 0)
        remotePCList = await this.remotePCService.findByRIdx(data.rIdx);
      // else remotePCList = await this.remotePCService.findAll();

      // this.server.to(client.id).emit('getRemotePCList', remotePCList || []);
      return remotePCList || [];
    } catch (error) {
      SocketGateway.logger.error(error);
      // this.server
      //   .to(client.id)
      //   .emit('error', { event: 'getRemotePCList', error: error.message });
      return [];
    }
  }

  @SubscribeMessage('registRemotePC')
  async registRemotePC(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const newRemotePC = data;
      newRemotePC.ip = data.ip4;
      newRemotePC.memory = data.mem;
      newRemotePC.isRegist = 1;
      newRemotePC.status = 'off';

      const result = await this.remotePCService.create(newRemotePC);
      // this.server.to(client.id).emit('registRemotePC', result);

      return result;
    } catch (error) {
      SocketGateway.logger.error(error);
      // this.server
      //   .to(client.id)
      //   .emit('error', { event: 'registRemotePC', error: error.message });
      return { event: 'getPoint', error };
    }
  }

  @SubscribeMessage('unregistRemotePC')
  async unregistRemotePC(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // TODO: PC방에서 PC를 삭제할때는 PC방의 PC방장만 삭제할 수 있도록 해야함.

      // 기존에 등록된 remotePC가 있는지 확인
      const remotePC = await this.remotePCService.findOneByPCIdx(data.pcIdx);
      if (remotePC) {
        remotePC.isRegist = 0;
        return await this.remotePCService.save(data.pcIdx, remotePC);
      }

      // this.server.to(client.id).emit('unregistRemotePC', result);

      return { result: 'success' };
    } catch (error) {
      SocketGateway.logger.error(error);

      // this.server.to(client.id).emit('unregistRemotePC', {
      //   event: 'unregistRemotePC',
      //   error: error.message,
      // });
      return { event: 'getPoint', error };
    }
  }

  @SubscribeMessage('getPoint')
  async getPoint(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const point = await this.pointService.findOneByMidx(data.mIdx);

      console.log(`getPoint: ${data.mIdx} ${point?.balance}`);

      return point;
    } catch (error) {
      SocketGateway.logger.error(error);
      // this.server
      //   .to(client.id)
      //   .emit('getPoint', { event: 'getPoint', error: error.message });
      return { event: 'getPoint', error };
    }
  }

  @SubscribeMessage('postUsage')
  async postUsage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      console.log('postUsage : ', data);

      // 기존에 등록된 remotePC가 있고 잔액이 0보다 많을때...
      const point = await this.pointService.findOneByMidx(data.mIdx);
      if (point && point.balance > 0) {
        data.point = (data.seconds / 60) * 20; // 1시간 1200원 기준 (1원=1포인트)
        const result = await this.usageService.create(data);

        // point update
        if (result?.uIdx && point.balance) {
          point.balance = point.balance - data.point;
          if (point.balance < 0) point.balance = 0;

          const update = await this.pointService.save(point);
          if (update.affected == 1) {
            return { result: 'success', balance: point.balance };
          }
        } else {
          return { result: 'fail', balance: point.balance };
        }
        return { result: 'fail', balance: 0 };
      } else {
        console.warn('postUsage error');
        return { result: 'fail', balance: 0 };
      }
    } catch (error) {
      SocketGateway.logger.error(error);
      this.server
        .to(client.id)
        .emit('postUsage', { event: 'postUsage', error: error.message });
    }
  }

  // @SubscribeMessage('events')
  // findAll(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }
}
