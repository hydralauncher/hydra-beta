import Card from "./card";
import Grid from "./grid";
import Header from "./header";
import Sidebar from "./sidebar";
import { SkeletonCard } from "./skeleton";
import {
  FILTERS,
  type FilterConfig,
} from "./filters.config";

export type { FilterConfig };

export const Catalogue = {
  SkeletonCard,
  Sidebar,
  Header,
  Grid,
  Card,
  FILTERS,
};
