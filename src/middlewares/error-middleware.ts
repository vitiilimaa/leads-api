import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro não identificado no servidor." });
    }
  } else {
    next();
  }
};
