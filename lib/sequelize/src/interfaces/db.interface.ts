export interface dbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  pool: {
    min: number;
    max: number;
  };
}
