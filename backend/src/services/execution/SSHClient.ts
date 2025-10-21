import { NodeSSH } from 'node-ssh';

export class SSHClient {
  private ssh: NodeSSH;

  constructor() {
    this.ssh = new NodeSSH();
  }

  async connect(config: {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
  }): Promise<void> {
    await this.ssh.connect({
      host: config.host,
      port: config.port || 22,
      username: config.username,
      password: config.password,
      privateKey: config.privateKey,
    });
  }

  async execute(command: string): Promise<{ stdout: string; stderr: string; code: number }> {
    const result = await this.ssh.execCommand(command);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code || 0,
    };
  }

  async disconnect(): Promise<void> {
    this.ssh.dispose();
  }
}