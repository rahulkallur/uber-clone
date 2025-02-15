import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
  declare status?: string;
  declare code?: number;
  declare remarks?: string;

  constructor({
    status,
    code,
    remarks,
  }: {
    status: string;
    code: number;
    remarks: string;
  }) {
    super(JSON.stringify({ status, code, remarks }));
    this.status = status;
    this.code = code;
    this.remarks = remarks;
  }
}

export const errorHandlingMiddleware = (
  err: Error | CustomError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  if (err instanceof CustomError)
    res.status(err.code || 500).send({
      status: err.status || "INTERNAL_ERROR",
      code: err.code || 500,
      remarks: err.remarks || "Internal Server Error",
    });
  else {
    console.error(err);

    res.status(500).send({
      status: "INTERNAL_ERROR",
      code: 500,
      remarks: "Internal Server Error",
    });
  }
};
