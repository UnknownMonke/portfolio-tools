export interface Equity {
  equityId: number;
  name: string | undefined;
  ticker: string | undefined;
  type: string | undefined;
  active: boolean;
  quantity: number | undefined;
  amount: number | undefined;
}