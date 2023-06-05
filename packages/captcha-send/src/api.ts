import { createAlova } from "alova";
import ReactHook from "alova/react";
import { mockRequestAdapter } from "./assets/mock";

export const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: ReactHook,
  requestAdapter: mockRequestAdapter,
  responsed: (response) => response.json()
});

export const sendCaptcha = (phoneNumber: string) =>
  alovaInst.Post<{ code: string }>("/captcha", { phoneNumber });
export const submitData = (phoneNumber: string, code: string) => alovaInst.Post<string>('/submit', { phoneNumber, code });