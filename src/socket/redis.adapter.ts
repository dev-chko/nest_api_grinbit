import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import Redis, {
  Command,
  RedisOptions,
  SentinelConnectionOptions,
} from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  public adapterConstructor: ReturnType<typeof createAdapter>;

  sentinelClient: any = null;

  getMasterAddr = async (): Promise<{ host: string; port: number }> => {
    const opts: RedisOptions & SentinelConnectionOptions = {
      host: 'cloudpc.grinbit.io',
      password: 'grinmaster12#$',
      role: 'master',
    };
    // const opts: RedisOptions & SentinelConnectionOptions = {
    //   name: 'mymaster',
    //   // role: 'master',
    //   sentinelPassword: 'grinmaster12#$',
    //   sentinels: [
    //     { host: 'cloudpc1.grinbit.io', port: 26379 },
    //     { host: 'cloudpc2.grinbit.io', port: 26379 },
    //     { host: 'clouddb2.grinbit.io', port: 26379 },
    //   ],
    // };
    this.sentinelClient = new Redis(26379, opts);

    const connected = await new Promise<boolean>((resolve, reject) => {
      const onReady = () => {
        console.log('Connected to redis sentinel.');
        resolve(true);

        this.sentinelClient.off('ready', onReady);
        this.sentinelClient.off('error', onError);
      };
      const onError = (error) => {
        console.error('Error connecting to Redis:', error.message);
        // reject(error);
        resolve(false);

        this.sentinelClient.off('ready', onReady);
        this.sentinelClient.off('error', onError);
      };
      this.sentinelClient.on('ready', onReady);
      this.sentinelClient.on('error', onError);
    });

    if (connected !== true) {
      return null;
    }

    // master switch event
    this.sentinelClient.on(
      '+switch-master',
      (masterName, oldIp, oldPort, newIp, newPort) => {
        console.log(
          `+switch-master: ${masterName} ${oldIp} ${oldPort} ${newIp} ${newPort}`,
        );
      },
    );

    try {
      const result = await this.sentinelClient.sendCommand(
        new Command('sentinel', ['get-master-addr-by-name', 'mymaster']),
      );
      const [ip, port] = result.toString().split(',');

      console.log(`master ip: ${ip} port: ${port}`);

      return { host: ip, port: Number(port) };
    } catch (error) {
      console.warn(error);

      return null;
    }
  };

  async connectToRedis(): Promise<void> {
    let result = null;
    let count = 1;

    //
    const sleep = (ms: number): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // connect to redis sentinel & get master addr
    do {
      if (count > 1) sleep(3 * 1000);
      else console.warn('Waiting for redis sentinel... retry: ', count);

      result = await this.getMasterAddr();

      count = count + 1;
    } while (!result);

    // create redis pubClient/subClient
    // eslint-disable-next-line prefer-const
    let { host, port } = result;

    if (process.env.NODE_ENV === 'development') {
      if (host === '10.0.0.32') {
        host = 'cloudpc1.grinbit.io';
      } else if (host === '10.0.0.211') {
        host = 'cloudpc2.grinbit.io';
      } else if (host === '10.0.0.152') {
        host = 'clouddb2.grinbit.io';
      }
    }

    // createClients(host, port);
    const pubClient = createClient({
      url: `redis://${host}:${port}`,
      password: process.env.REDIS_PASSWORD,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);

    pubClient.on('connect', () => {
      console.log(`pubClient connected`);
    });

    pubClient.on('error', (err) => {
      console.warn('pubClient: ', err);
    });

    subClient.on('connect', () => {
      console.log(`subClient connected`);
    });

    subClient.on('error', (err) => {
      console.warn('subClient: ', err);
    });
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
