import {
  BackendCommon,
  ByID,
  FrontendCommon,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
} from "./common-types";

export interface OrderBase {
  student_id: string;
  nameKo: string;
  nameEn: string;
  product_id: string;
  name: string;
  img_url: string;
  type: number;
  desc: string;
  price: number;
  amount: number;
  //1: 주문대기, 2: 배송대기, 3: 수령대기 4: 수령완료, 5:주문취소
  status: number;
}

export interface BackendOrder extends OrderBase, BackendCommon {}

export interface FrontendOrder extends OrderBase, FrontendCommon {}

export type GetOrdersInput = GetTableInput & Pick<OrderBase, "status">;
export type GetOrdersOutput = TableOutput<FrontendOrder[]>;

export type GetStudentOrdersInput = ByID & GetTableInput;
export type GetStudentOrdersOutput = TableOutput<FrontendOrder[]>;

export type GetOrderByIdInput = ByID;
export type GetOrderByIdOutput = QueryOutput<FrontendOrder>;

export type UpdateOrderStatusInput = ByID & {
  type: number;
  status_from: number;
};
export type UpdateOrderStatusOutput = MutateOutput;

export type CancelOrderInput = ByID;
export type CancelOrderOutput = MutateOutput;
