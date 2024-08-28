import { Request, Response } from "express";

export const healthCheck = async (_: Request, res: Response): Promise<void> => {
  const data = { msg: "Up!" };
  console.log(data);
  res.json(data);
};
