import demo from "./demo.json";
import sunset from "./sunset.json";
import type { Brand } from "../src/types";

// New brand: create brands/<id>.json and register it here.
export const BRANDS: Record<string, Brand> = {
  demo: demo as Brand,
  sunset: sunset as Brand,
};
