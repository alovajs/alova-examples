import { createAlovaMockAdapter, defineMock } from "@alova/mock";
import GlobalFetch from "alova/GlobalFetch";

// mock data.
const mockData = defineMock({
  "[POST]/captcha": () => {
    return {
      code: Math.random().toString().slice(2, 6)
    }
  },
  "[POST]/submit": ({ data }) => {
    return JSON.stringify(data);
  }
});

export const mockRequestAdapter = createAlovaMockAdapter([mockData], {
  delay: 1200,
  httpAdapter: GlobalFetch()
});