export const checkResponse = (response: Response) => {
  if (response.status === 401) {
    console.log("Unauthorized response. Redirecting to login.");
    window.location.replace("/api/login");
    return;
  }

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

export const wrapError = (possibleError: unknown): Error => {
  if (possibleError instanceof Error) {
    return possibleError;
  }
  return new Error(
    `An a non error type was thrown: [${JSON.stringify(possibleError)}]`
  );
};

export * from "./candidates";
export * from "./store";
export * from "./votes";
