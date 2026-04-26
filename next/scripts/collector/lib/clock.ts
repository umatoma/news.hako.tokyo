export type Clock = () => Date;

export const systemClock: Clock = () => new Date();

export function fixedClock(iso: string): Clock {
  const date = new Date(iso);
  return () => date;
}
