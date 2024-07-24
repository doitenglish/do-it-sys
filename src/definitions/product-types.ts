import {
  BackendCommon,
  ByID,
  FrontendCommon,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
} from "./common-types";

export interface ProductBase {
  type: number;
  name: string;
  price: number;
  img_url: string;
  product_url: string;
}

interface Countable {
  totalOrders: number;
}

export interface BackendProduct extends ProductBase, BackendCommon, Countable {
  tags: string[];
}

export interface FrontendProduct
  extends ProductBase,
    FrontendCommon,
    Countable {}

export type CreateProductInput = ByID &
  ProductBase & {
    tag: string; //포함하는 고유 대명사
  };
export type CreateProductOutput = MutateOutput;

export type UpdateProductInput = ByID & Omit<ProductBase, "name" | "img_url">;
export type UpdateProductOutput = MutateOutput;

export type DeleteProductInput = ByID;
export type DeleteProductOutput = MutateOutput;

export type GetProductsInput = GetTableInput & {
  product_type: number; //1: online, 2: offline
  order_type: number; //1:인기순, 2: 높은가격순, 3:낮은가격순
};
export type GetProductsOutput = TableOutput<FrontendProduct[]>;

export type GetProductByIdInput = ByID;
export type GetProductByIdOutput = QueryOutput<FrontendProduct>;

export type GetProductsBySearchInput = GetTableInput & {
  product_type: number;
};
export type GetProductsBySearchOutput = TableOutput<FrontendProduct[]>;
