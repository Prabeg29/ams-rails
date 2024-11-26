export type Record<K extends string, V> = { [key in K]: V };
export function classname(...args: (string | Record<string, boolean> | null | undefined | number)[]): string {
	return args
		.filter(Boolean)
		.map((arg) => {
			if (typeof arg === "string") return arg;
			if (typeof arg === "number") return String(arg);
			if (arg === null || arg === undefined) return "";
			return Object.entries(arg)
				.filter(([, value]) => value)
				.map(([key]) => key)
				.join(" ");
		})
		.join(" ");
}


export const formatDateTimeToYMD = (dateTime: string): string => {
	const date = new Date(dateTime);

	if (!date || isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
	const day = (date.getDate() + 1) < 10 ? `0${(date.getDate() + 1)}` : (date.getDate() + 1);
	
  return `${year}-${month}-${day}`;
};