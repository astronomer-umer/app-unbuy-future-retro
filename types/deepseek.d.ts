declare module "deepseek" {
     export class DeepSeek {
          extractFilters(query: string): Promise<Record<string, any>>;
     }
}