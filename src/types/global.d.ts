export {};
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GUILD_URLS: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }