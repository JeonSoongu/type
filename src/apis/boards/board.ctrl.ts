import * as express from "express";
import logger from "../../config/logger";
import Board from "../../models/Board/Board";

interface response {
  success?: boolean;
  msg?: string;
  isError?: boolean;
  errMsg?: string;
  clientMsg?: string;
}

const process = {
  createByCategoryName: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.createByCategoryName();
    if (response.success) {
      logger.info(`POST api/boards/categoryName 201 ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST api/boards/categoryName 400 ${response.errMsg}`);
      return res.status(400).json(response.clientMsg);
    }
    logger.info(`POST api/boards/categoryName 500 ${response.msg}`);
    return res.status(500).json(response);
  },

  findAllByCategoryNum: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.findAllByCategoryNum();
    if (response.success) {
      logger.info(`GET api/boards/categoryName 200 ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET api/boards/categoryName 400 ${response.errMsg}`);
      return res.status(400).json(response.clientMsg);
    }
    logger.error(`GET api/boards/categoryName 400 ${response.msg}`);
    return res.status(400).json(response);
  },

  findOneByNum: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.findOneByNum();
    if (response.success) {
      logger.info(`GET /api/boards/categoryName/num 200 ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/boards/categoryName/num 400 ${response.errMsg}`);
      return res.status(400).json(response.clientMsg);
    }
  },

  updateByNum: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.updateByNum();
    if (response.success) {
      logger.info(`PUT /api/boards/categoryName/num 200 ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PUT /api/boards/categoryName/num 400 ${response.errMsg}`);
      return res.status(400).json(response.clientMsg);
    }
  },

  updateOnlyHit: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.updateOnlyHit();
    if (response.success) {
      logger.info(`PATCH /api/boards/categoryName/num 200 ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PATCH /api/boards/categoryName/num 400 ${response.errMsg}`);
      return res.status(400).json(response.clientMsg);
    }
  },

  updateOnlyStatus: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.updateOnlyStatus();
    if (response.success) {
      logger.info(
        `PATCH /api/boards/categoryName/num/status 200 ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PATCH /api/boards/categoryName/num/status 400 ${response.errMsg}`
      );
      return res.status(400).json(response.clientMsg);
    }
  },

  deleteByNum: async (req : express.Request, res : express.Response) => {
    const board = new Board(req);
    const response : response = await board.deleteByNum();
    if (response.success) {
      logger.info(`DELETE /api/boards/categoryName/num 200 ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/boards/categoryName/num 400 ${response.errMsg}`
      );
      return res.status(400).json(response.clientMsg);
    }
  },
};

export { process };
