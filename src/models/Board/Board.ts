import * as express from "express";
import BoardStorage from "./BoardStorage";
import Category from "../Category/Category";
import String from "../../utils/String";
import CommentStorage from "./Comment/CommentStorage";
import Error from "../../utils/Error";

interface response {
  success: boolean;
  msg: string;
  num?: number;
  status?: number;
  watchListFlag?: number;
  categoryName?: string | number;
  boards?: boardsAll[];
  replaceArrayByBoard?: boards;
  replaceArrayByComment?: comments[];
}

interface boardsAll {
  num: number;
  studentId: string;
  profilePath: string;
  nickname: string;
  thumbnail: string;
  title: string;
  hit: number;
  price: string;
  commentCount: number;
  status: number;
  inDate: string;
}

interface boards {
  num: number;
  studentId: string;
  profilePath: string;
  nickname: string;
  studentName: string;
  title: string
  content: string
  hit: number
  price: string;
  status: number;
  inDate: number
  updateDate: string;
  categoryNum?: number;
}

interface comments {
  studentId: string;
  studentName: string;
  profilePath: string;
  nickname: string;
  commentNum: number;
  commentContent: string;
  commentGroupNum: number;
  commentDepth: number;
  commentReplyFlag: number;
  commentHiddenFlag: number;
  commentInDate: string;
}

interface error {
  isError: boolean;
  errMsg: string;
  clientMsg: string;
}

interface Category {
  [key: string] : string;
}

class Board {
  body: any;
  params: any;
  query: any;
  
  constructor(readonly req : express.Request) {
    this.body = req.body;
    this.params = req.params;
    this.query = req.query;
  }

  async createByCategoryName() : Promise<response | error> {
    const board = this.body;
    const categoryName : keyof Category = this.params.categoryName;
    const categoryNum : number = Category[categoryName];

    if (categoryNum === undefined)
      return { success: false, msg: "요청하신 경로가 잘못되었습니다." };

    if (!board.thumbnail) {
      board.thumbnail = process.env.DEFAULT_THUMBNAIL;
    }

    if (!board.price) {
      board.price = "0";
    }

    if (board.price < 0 || board.price.toString().length >= 8) {
      return {
        success: false,
        msg: "가격은 0 ~ 9999999 까지만 입력 가능합니다.",
      };
    }
    board.price = String.makePrice(board.price);

    try {
      const { success, num } = await BoardStorage.create(categoryNum, board);
      if (success) {
        return { success: true, msg: "게시판 생성에 성공하셨습니다.", num };
      }
      return {
        success: false,
        msg: "알 수 없는 에러입니다. 서버 개발자에게 문의해주세요",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async findAllByCategoryNum() : Promise<response | error> {
    const categoryName : keyof Category = this.params.categoryName;
    const categoryNum : number = Category[categoryName];
    const lastNum : any = this.query.lastNum;

    if (categoryNum === undefined) {
      return { success: false, msg: "존재하지 않는 게시판입니다." };
    }

    try {
      const boardsAll = await BoardStorage.findAllByCategoryNum(
        categoryNum,
        lastNum
      );

      const boards: boardsAll[] = Object.values(
        JSON.parse(JSON.stringify(boardsAll))
      );

      if (boards) {
        return { success: true, msg: "게시판 조회 성공", boards };
      }
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async findOneByNum() : Promise<response | error> {
    const num : number = parseInt(this.params.num);
    const categoryName : keyof Category = this.params.categoryName;
    const categoryNum : number = Category[categoryName];
    const studentId : string = this.params.studentId;

    if (categoryNum === undefined)
      return { success: false, msg: "존재하지 않는 게시판입니다." };

    try {
      const boards = await BoardStorage.findOneByNum(num);
      const comments = await CommentStorage.findAllByBoardNum(num);
      const watchListFlag = await BoardStorage.findOneWatchListFlag(
        studentId,
        num
      );

      const board: boards[] = Object.values(
        JSON.parse(JSON.stringify(boards))
      );
      const replaceArrayByBoard = board[0];

      const replaceArrayByComment: comments[] = Object.values(
        JSON.parse(JSON.stringify(comments))
      );

      if (categoryNum === replaceArrayByBoard.categoryNum) {
        return {
          success: true,
          msg: "게시판 상세 조회 성공",
          replaceArrayByBoard,
          replaceArrayByComment,
          watchListFlag,
          categoryName,
        };
      }
      return { success: false, msg: "게시판 상세 조회 실패" };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async updateByNum() : Promise<response | error> {
    const num : number = parseInt(this.params.num);
    const body : any = this.body;

    if (body.price < 0 || body.price.toString().length >= 8) {
      return {
        success: false,
        msg: "가격은 0 ~ 9999999 까지만 입력 가능합니다.",
      };
    }
    body.price = String.makePrice(body.price);

    try {
      const board = await BoardStorage.findOneByNum(num);
      if (!board) return { success: false, msg: "존재하지 않는 게시판입니다." };

      const { success, boardNum } = await BoardStorage.updateByNum(body, num);
      if (success) {
        return {
          success: true,
          msg: "게시판 수정에 성공하셨습니다.",
          num: boardNum,
        };
      }
      return {
        success: false,
        msg: "알 수 없는 에러입니다. 서버 개발자에게 문의해주십시오.",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async updateOnlyHit() : Promise<response | error> {
    const categoryNum : number = Category[this.params.categoryName];
    const num : number = parseInt(this.params.num);

    if (categoryNum === undefined)
      return { success: false, msg: "존재하지 않는 게시판입니다." };

    try {
      const board = await BoardStorage.findOneByNum(num);
      if (!board) return { success: false, msg: "존재하지 않는 게시판입니다." };

      const isUpdate = await BoardStorage.updateOnlyHitByNum(num);
      if (isUpdate) return { success: true, msg: "조회수가 1 증가하였습니다." };

      return {
        success: false,
        msg: "알 수 없는 에러입니다. 서버 개발자에게 문의해주십시오.",
      };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async deleteByNum() : Promise<response | error> {
    const num : number = parseInt(this.params.num);

    try {
      const isDelete = await BoardStorage.delete(num);
      if (isDelete) {
        return { success: true, msg: "게시판 삭제 성공" };
      }
      return { success: false, msg: "게시판 삭제 실패" };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async search() : Promise<response | error> {
    const categoryNum = Category[this.query.categoryName];
    const title = this.query.content;

    try {
      const boardsSearch = await BoardStorage.findAllByIncludedTitleAndCategory(
        title,
        categoryNum
      );

      const boards: boardsAll[] = Object.values(
        JSON.parse(JSON.stringify(boardsSearch))
      );

      const response = {
        success: true,
        msg: `${title}(으)로 검색된 결과입니다.`,
        boards,
      };

      return response;
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }

  async updateOnlyStatus() : Promise<response | error> {
    const num = this.params.num;
    const body = this.body;

    try {
      const isUpdate = await BoardStorage.updateOnlyStatusByNum(body, num);
      if (isUpdate)
        return {
          success: true,
          msg: "status가 변경되었습니다.",
          status: body.status,
        };
      return { success: false, msg: "존재하지않는 게시판" };
    } catch (err) {
      return Error.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err);
    }
  }
}

export default Board;
