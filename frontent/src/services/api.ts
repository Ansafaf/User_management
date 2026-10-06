export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    let notice = "";
    try {
      const payload: unknown = await response.clone().json();
      if (typeof payload === "object" && payload !== null && "code" in payload) {
        if (payload.code === "ACCOUNT_DELETED") notice = "deleted";
        if (payload.code === "ACCOUNT_BLOCKED") notice = "blocked";
      }
    } catch {
      // The response may not contain JSON; still clear the rejected session.
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = notice ? `/login?notice=${notice}` : "/login";
  }

  return response;
};