type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function logStructured(
  level: LogLevel,
  event: string,
  payload?: Record<string, unknown>,
): void {
  const row = {
    level,
    event,
    service: 'arcturus-api',
    time: new Date().toISOString(),
    ...(payload ?? {}),
  };

  const text = JSON.stringify(row);

  if (level === 'error') {
    console.error(text);
  } else if (level === 'warn') {
    console.warn(text);
  } else {
    console.log(text);
  }
}