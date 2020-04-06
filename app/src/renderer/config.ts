const isDev: boolean = (process.env.NODE_ENV === 'development');
const apiHost: string = isDev ? 'http://localhost:8100' : 'https://yourdomain.com';

export { isDev, apiHost };
