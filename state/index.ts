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

export * from "./candidates";
export * from "./store";
export * from "./votes";
