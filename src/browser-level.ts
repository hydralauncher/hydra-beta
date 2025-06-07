import { Level } from "level";

export const getLevelInstance = <T>() =>
  new Level<string, T>("hydra-db", {
    valueEncoding: "json",
  });
